import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildWhatsAppUrl, getWhatsAppNumberFromUrl, normalizeWhatsAppNumber } from '../src/lib/whatsapp.js';

test('generates WhatsApp links from local and international Indonesian numbers', () => {
  for (const input of ['081222828282', '6281222828282', '+6281222828282', '0812-2282-8282', '+62 (812) 2282 8282', '81222828282']) {
    assert.equal(normalizeWhatsAppNumber(input), '6281222828282');
    assert.equal(buildWhatsAppUrl(input), 'https://wa.me/6281222828282');
  }
});

test('rejects invalid phone inputs instead of silently removing letters or URL syntax', () => {
  for (const input of ['', null, 81222828282, '0812', '0812abc22828282', 'https://wa.me/6281222828282', '006281222828282', '+1 81222828282', '081222828282;alert(1)', '081222828282828282828282']) {
    assert.equal(buildWhatsAppUrl(input), '');
  }
});

test('existing WhatsApp links fill the number field and retain saved message text when unchanged', () => {
  const existing = 'https://wa.me/6281222828282?text=Halo%20AmazingCraft';
  assert.equal(getWhatsAppNumberFromUrl(existing), '6281222828282');
  assert.equal(buildWhatsAppUrl('081222828282', existing), existing);
  assert.equal(getWhatsAppNumberFromUrl('https://api.whatsapp.com/send?phone=6281222828282&text=Halo'), '6281222828282');
  assert.equal(buildWhatsAppUrl('081333444555', existing), 'https://wa.me/6281333444555');
});

test('unrelated or unsafe legacy links do not become phone numbers', () => {
  for (const url of ['https://example.com/6281222828282', 'https://wa.me.evil.test/6281222828282', 'javascript:alert(1)', 'https://user:pass@wa.me/6281222828282', 'https://wa.me/message/anything']) {
    assert.equal(getWhatsAppNumberFromUrl(url), '');
  }
});
