import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { test } from 'node:test';
import { getSafeRedirectPath, getTokenExp, isTokenExpired } from '../src/lib/auth.js';

const b64url = value => Buffer.from(value).toString('base64url');
const makeToken = payload => `${b64url('{"alg":"HS256","typ":"JWT"}')}.${b64url(JSON.stringify(payload))}.signature`;
const now = () => Math.floor(Date.now() / 1000);

test('reads exp from a JWT payload (base64url, no padding, UTF-8)', () => {
  assert.equal(getTokenExp(makeToken({ role: 'PLAYER', exp: 1893456000 })), 1893456000);
  assert.equal(getTokenExp(makeToken({ minecraftName: 'Ünïcode~?>', exp: 42 })), 42);
});

test('treats missing, malformed or exp-less tokens as expired', () => {
  for (const token of [undefined, null, '', 'abc', 'a.b', 'a.b.c', 'a.!!!.c', 12345, makeToken({ role: 'PLAYER' }), makeToken({ exp: 'soon' })]) {
    assert.equal(getTokenExp(token), null);
    assert.equal(isTokenExpired(token), true);
  }
});

test('expiry honours the skew window', () => {
  assert.equal(isTokenExpired(makeToken({ exp: now() + 3600 })), false);
  assert.equal(isTokenExpired(makeToken({ exp: now() - 1 })), true);
  assert.equal(isTokenExpired(makeToken({ exp: now() + 10 })), true); // inside the default 30s skew
  assert.equal(isTokenExpired(makeToken({ exp: now() + 10 }), 0), false);
});

test('only same-origin relative paths are valid redirect targets', () => {
  assert.equal(getSafeRedirectPath('/checkout'), '/checkout');
  assert.equal(getSafeRedirectPath('/shop?server=1#top'), '/shop?server=1#top');
  for (const path of [null, undefined, '', 'checkout', '//evil.com', '/\\evil.com', '/\t/evil.com', 'https://evil.com', 'javascript:alert(1)', 42]) {
    assert.equal(getSafeRedirectPath(path), null);
  }
});
