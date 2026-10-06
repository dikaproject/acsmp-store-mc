import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchServerStatus } from '../src/lib/serverStatus.js';

const primary = 'https://api.mcsrvstat.us/3/amazingcraft.org';
const fallback = 'https://api.mcstatus.io/v2/status/java/amazingcraft.org';
const online = { online: true, players: { online: 37, max: 200 }, motd: { clean: ['Amazing Craft'] } };
const response = data => ({ ok: true, json: async () => data });

test('uses Java status with SRV resolution and returns real player counts', async () => {
  const calls = [];
  const result = await fetchServerStatus(async (url, options) => {
    calls.push(url);
    assert.ok(options.signal instanceof AbortSignal);
    return response(online);
  });

  assert.deepEqual(calls, [primary]);
  assert.deepEqual(result.serverData, online);
  assert.ok(Number.isInteger(result.responseTime) && result.responseTime >= 0);
});

test('checks the second provider when the first reports offline', async () => {
  const calls = [];
  const result = await fetchServerStatus(async url => {
    calls.push(url);
    return response(url === primary ? { online: false } : online);
  });

  assert.deepEqual(calls, [primary, fallback]);
  assert.equal(result.serverData.online, true);
});

test('recovers from HTTP errors without treating their JSON as server status', async () => {
  const result = await fetchServerStatus(async url => url === primary
    ? { ok: false, status: 429, json: () => assert.fail('Must check HTTP status first') }
    : response(online));

  assert.deepEqual(result.serverData, online);
});

test('recovers from network errors', async () => {
  const result = await fetchServerStatus(async url => {
    if (url === primary) throw new TypeError('Failed to fetch');
    return response(online);
  });

  assert.equal(result.serverData.online, true);
});

test('recovers from invalid JSON', async () => {
  const result = await fetchServerStatus(async url => url === primary
    ? { ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } }
    : response(online));

  assert.equal(result.serverData.online, true);
});

test('requires a boolean online value before trusting a status payload', async () => {
  for (const invalid of [null, {}, { online: 'false' }]) {
    const result = await fetchServerStatus(async url => response(url === primary ? invalid : online));
    assert.equal(result.serverData.online, true);
  }
});

test('reports offline only when both providers confirm it', async () => {
  const calls = [];
  const result = await fetchServerStatus(async url => {
    calls.push(url);
    return response({ online: false });
  });

  assert.deepEqual(calls, [primary, fallback]);
  assert.equal(result.serverData.online, false);
});

test('API outages remain unavailable instead of becoming false offline', async () => {
  for (const failedProvider of [primary, fallback, 'both']) {
    await assert.rejects(fetchServerStatus(async url => {
      if (url === failedProvider || failedProvider === 'both') throw new Error('API unavailable');
      return response({ online: false });
    }), /temporarily unavailable/);
  }
});

test('preserves zero players and the fallback provider MOTD format', async () => {
  const fallbackData = { online: true, players: { online: 0, max: 200 }, motd: { clean: 'Amazing Craft\nSurvival' } };
  const result = await fetchServerStatus(async url => response(url === primary ? { online: false } : fallbackData));

  assert.deepEqual(result.serverData, fallbackData);
});

test('aborts a stalled request and proceeds to the fallback', async context => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  let aborted = false;
  const pending = fetchServerStatus((url, { signal }) => {
    if (url === fallback) return Promise.resolve(response(online));
    return new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => {
        aborted = true;
        reject(new Error('Request timed out'));
      }, { once: true });
    });
  });

  context.mock.timers.tick(10000);
  const result = await pending;
  assert.equal(aborted, true);
  assert.equal(result.serverData.online, true);
});
