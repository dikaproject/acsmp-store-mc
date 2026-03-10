const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;   // 96-bit recommended for GCM
const TAG_LENGTH = 16;  // 128-bit auth tag

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  // Accept 64-char hex (32 bytes) or raw 32-byte string
  if (/^[0-9a-fA-F]{64}$/.test(key)) {
    return Buffer.from(key, 'hex');
  }
  if (Buffer.byteLength(key) === 32) {
    return Buffer.from(key);
  }
  throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
}

/**
 * Encrypt plaintext.
 * @returns {string} "iv:authTag:ciphertext" in hex
 */
function encrypt(plaintext) {
  const keyBuf = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuf, iv, { authTagLength: TAG_LENGTH });

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
}

/**
 * Decrypt a value produced by encrypt().
 * @returns {string} plaintext
 */
function decrypt(stored) {
  const keyBuf = getKey();
  const parts = stored.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted value format');
  }
  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encryptedBuf = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuf, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encryptedBuf), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
