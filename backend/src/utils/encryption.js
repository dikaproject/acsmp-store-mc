const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;        // 96-bit IV recommended for GCM
const TAG_LENGTH = 16;       // 128-bit auth tag
const VERSION = 'v2';        // current format version (enables crypto-agility)
const AAD = Buffer.from('rcon-password');  // binds ciphertext to its purpose

// Example key shipped in docs — must never be used as a real key.
const EXAMPLE_ENCRYPTION_KEY = 'a3f1c2d4e5b6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2';

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  // Prefer a 64-char hex string (full 32 bytes / 256 bits of entropy).
  if (/^[0-9a-fA-F]{64}$/.test(key)) {
    return Buffer.from(key, 'hex');
  }
  // Accept a raw 32-byte string for backward compatibility, but warn:
  // ASCII strings have far less entropy than random 32 bytes.
  if (Buffer.byteLength(key) === 32) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[ENCRYPTION] ENCRYPTION_KEY is a raw 32-char string. Prefer a 64-char hex random key for stronger entropy.');
    }
    return Buffer.from(key);
  }
  throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
}

/**
 * Encrypt plaintext with AES-256-GCM.
 * Output format: "v2:iv:authTag:ciphertext" (all hex).
 * @returns {string}
 */
function encrypt(plaintext) {
  if (typeof plaintext !== 'string' || plaintext.length === 0) {
    throw new Error('encrypt() requires a non-empty string');
  }
  const keyBuf = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuf, iv, { authTagLength: TAG_LENGTH });
  cipher.setAAD(AAD);

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [VERSION, iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
}

/**
 * Decrypt a value produced by encrypt().
 * Supports the current "v2:..." format (with AAD) and the legacy
 * "iv:authTag:ciphertext" format (no AAD) for backward compatibility.
 * @returns {string} plaintext
 */
function decrypt(stored) {
  if (typeof stored !== 'string') {
    throw new Error('Invalid encrypted value');
  }
  const keyBuf = getKey();
  const parts = stored.split(':');

  let ivHex, authTagHex, encryptedHex, useAad;

  if (parts.length === 4 && parts[0] === VERSION) {
    // Current versioned format
    [, ivHex, authTagHex, encryptedHex] = parts;
    useAad = true;
  } else if (parts.length === 3) {
    // Legacy format (pre-versioning, no AAD)
    [ivHex, authTagHex, encryptedHex] = parts;
    useAad = false;
  } else {
    throw new Error('Invalid encrypted value format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encryptedBuf = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuf, iv, { authTagLength: TAG_LENGTH });
  if (useAad) decipher.setAAD(AAD);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encryptedBuf), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt, EXAMPLE_ENCRYPTION_KEY };
