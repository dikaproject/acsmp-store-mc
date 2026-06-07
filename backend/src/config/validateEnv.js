// src/config/validateEnv.js
// Fail-fast validation of security-critical environment variables on startup.

// Known weak/default values that must never be used in production.
const WEAK_JWT_SECRETS = new Set([
  'your_jwt_secret_key',
  'your-super-secret-jwt-key-change-this-in-production',
  'secret',
  'changeme',
  ''
]);

const EXAMPLE_ENCRYPTION_KEY = 'a3f1c2d4e5b6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2';

function validateEnv() {
  const isProd = process.env.NODE_ENV === 'production';
  const errors = [];
  const warnings = [];

  // --- JWT_SECRET ---
  const jwtSecret = process.env.JWT_SECRET || '';
  if (!jwtSecret) {
    errors.push('JWT_SECRET is not set.');
  } else if (WEAK_JWT_SECRETS.has(jwtSecret)) {
    const msg = 'JWT_SECRET is set to a known default/weak value. Anyone can forge admin tokens. ' +
      'Generate a strong secret, e.g.: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"';
    if (isProd) errors.push(msg);
    else warnings.push(msg);
  } else if (jwtSecret.length < 32) {
    const msg = 'JWT_SECRET is shorter than 32 characters and is considered weak.';
    if (isProd) errors.push(msg);
    else warnings.push(msg);
  }

  // --- ENCRYPTION_KEY (used for RCON password encryption) ---
  const encKey = process.env.ENCRYPTION_KEY || '';
  if (!encKey) {
    errors.push('ENCRYPTION_KEY is not set (required to encrypt/decrypt RCON passwords).');
  } else {
    const isHex64 = /^[0-9a-fA-F]{64}$/.test(encKey);
    const isRaw32 = Buffer.byteLength(encKey) === 32;
    if (!isHex64 && !isRaw32) {
      errors.push('ENCRYPTION_KEY must be a 64-character hex string (32 bytes). ' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    }
    if (encKey === EXAMPLE_ENCRYPTION_KEY) {
      const msg = 'ENCRYPTION_KEY is set to the example value from documentation. Replace it with a unique key.';
      if (isProd) errors.push(msg);
      else warnings.push(msg);
    }
  }

  // --- DUMMY_MODE should never be on in production ---
  if (isProd && process.env.DUMMY_MODE === 'true') {
    errors.push('DUMMY_MODE must not be "true" in production (it bypasses RCON player verification).');
  }

  // --- Report ---
  warnings.forEach(w => console.warn(`[ENV WARNING] ${w}`));

  if (errors.length > 0) {
    console.error('\n[ENV VALIDATION FAILED]');
    errors.forEach(e => console.error(`  ✗ ${e}`));
    console.error('');
    // In production a misconfigured secret is fatal; abort startup.
    if (isProd) {
      throw new Error('Environment validation failed. Fix the issues above before starting in production.');
    } else {
      console.error('[ENV] Continuing in non-production mode despite the issues above. FIX THESE BEFORE DEPLOYING.\n');
    }
  }
}

module.exports = validateEnv;
