const axios = require('axios');

const FONNTE_API_URL = 'https://api.fonnte.com/send';

/**
 * Send a WhatsApp message via Fonnte API.
 * Requires FONNTE_TOKEN in environment variables.
 * If not configured, silently skips (no crash).
 */
async function sendMessage(phone, message) {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.warn('[FONNTE] FONNTE_TOKEN not set, skipping WA notification');
    return;
  }

  if (!phone) {
    console.warn('[FONNTE] No phone number, skipping WA notification');
    return;
  }

  // Normalize phone: strip leading 0, ensure starts with 62
  let normalized = phone.replace(/\D/g, '');
  if (normalized.startsWith('0')) normalized = '62' + normalized.slice(1);
  if (!normalized.startsWith('62')) normalized = '62' + normalized;

  try {
    const res = await axios.post(
      FONNTE_API_URL,
      {
        target: normalized,
        message,
        countryCode: '62'
      },
      {
        headers: { Authorization: token }
      }
    );
    console.log('[FONNTE] Message sent to', normalized, '| status:', res.data?.status);
  } catch (err) {
    console.error('[FONNTE] Failed to send WA:', err.message);
  }
}

/**
 * Build WA message for PAID order
 */
function buildPaidMessage(order) {
  const lines = [
    `✅ *Pembayaran Berhasil!*`,
    ``,
    `Halo *${order.minecraftName}*, pembayaranmu sudah kami terima!`,
    ``,
    `📋 *Detail Pesanan*`,
    `• Kode Order: \`${order.orderCode}\``,
    `• Server: ${order.serverType?.name || '-'}`,
    `• Total: Rp ${Number(order.totalAmount).toLocaleString('id-ID')}`,
    `• Status: PAID ✅`,
    ``,
    `⚙️ Item sedang diproses dan akan segera dikirim ke akun Minecraftmu.`,
    ``,
    `Terima kasih sudah berbelanja! 🎮`
  ];
  return lines.join('\n');
}

/**
 * Build WA message for COMPLETED order (item delivered)
 */
function buildCompletedMessage(order) {
  const itemList = order.items
    ? order.items.map(i => `  • ${i.product?.name || 'Item'} x${i.quantity}`).join('\n')
    : '';

  const lines = [
    `🎉 *Pesanan Selesai!*`,
    ``,
    `Halo *${order.minecraftName}*, item-mu sudah berhasil dikirim!`,
    ``,
    `📦 *Item yang diterima:*`,
    itemList,
    ``,
    `🎮 Login ke server *${order.serverType?.name || '-'}* dan cek inventorymu.`,
    ``,
    `📋 Kode Order: \`${order.orderCode}\``,
    ``,
    `Selamat bermain dan terima kasih! 💚`
  ];
  return lines.join('\n');
}

module.exports = { sendMessage, buildPaidMessage, buildCompletedMessage };
