export function normalizeWhatsAppNumber(value) {
  if (typeof value !== 'string' || !/^\+?[\d\s()-]+$/.test(value.trim())) return '';
  let number = value.trim().replace(/[\s()-]/g, '').replace(/^\+/, '');
  if (number.startsWith('0')) number = `62${number.slice(1)}`;
  else if (number.startsWith('8')) number = `62${number}`;
  return /^628\d{7,12}$/.test(number) ? number : '';
}

export function getWhatsAppNumberFromUrl(value) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return '';
    if (url.hostname === 'wa.me') {
      return normalizeWhatsAppNumber(url.pathname.match(/^\/(\d+)\/?$/)?.[1]);
    }
    if (['api.whatsapp.com', 'web.whatsapp.com', 'www.whatsapp.com', 'whatsapp.com'].includes(url.hostname)) {
      return normalizeWhatsAppNumber(url.searchParams.get('phone'));
    }
  } catch {
    return '';
  }
  return '';
}

export function buildWhatsAppUrl(value, previousUrl = '') {
  const number = normalizeWhatsAppNumber(value);
  if (!number) return '';
  // Keep existing message parameters when editing the same contact number.
  if (getWhatsAppNumberFromUrl(previousUrl) === number) return previousUrl;
  return `https://wa.me/${number}`;
}
