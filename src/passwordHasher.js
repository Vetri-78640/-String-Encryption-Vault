/**
 * Password Hasher Implementation
 * Secure password hashing utilities with multiple algorithms (PBKDF2, bcrypt simulation)
 * Supports salt generation, verification, and cost/strength customization
 *
 * @module passwordHasher
 */

import crypto from 'crypto';

/**
 * Generates a random salt for password hashing
 * Uses cryptographically secure random bytes
 *
 * @param {number} [length=16] - Length of salt in bytes
 * @returns {string} Base64-encoded salt
 * @throws {Error} If length is not a positive number
 *
 * @example
 * generateSalt()
 * // Returns something like: 'a3Bc9XyZ2kL4mNoPqRs'
 * generateSalt(32)
 * // Returns a longer salt with 32 bytes
 */
export function generateSalt(length = 16) {
  if (typeof length !== 'number' || length < 1) {
    throw new Error('Salt length must be a positive number');
  }

  const salt = crypto.randomBytes(length);
  return salt.toString('base64');
}

/**
 * Hashes a password using PBKDF2 algorithm
 * Uses SHA-256 digest with configurable iterations
 * Separates salt from hash with ':' delimiter
 *
 * @param {string} password - The password to hash
 * @param {string} [salt] - Optional salt (generated if not provided)
 * @param {number} [iterations=100000] - PBKDF2 iterations (higher = slower)
 * @returns {object} {hash, salt, iterations} all as strings
 * @throws {Error} If password is not a string or is empty
 *
 * @example
 * const result = hashPassword('myPassword123')
 * // Returns {
 * //   hash: 'base64EncodedHash',
 * //   salt: 'base64EncodedSalt',
 * //   iterations: '100000'
 * // }
 */
export function hashPassword(password, salt = null, iterations = 100000) {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password must be a non-empty string');
  }

  if (typeof iterations !== 'number' || iterations < 1000) {
    throw new Error('Iterations must be a number >= 1000');
  }

  const useSalt = salt || generateSalt();
  const saltBuffer = Buffer.from(useSalt, 'base64');

  const hash = crypto.pbkdf2Sync(
    password,
    saltBuffer,
    iterations,
    32,
    'sha256',
  );

  return {
    hash: hash.toString('base64'),
    salt: useSalt,
    iterations: iterations.toString(),
  };
}

/**
 * Verifies a password against a stored hash
 * Compares using timing-safe constant-time comparison
 *
 * @param {string} password - The password to verify
 * @param {string} storedHash - The stored hash (hash:salt:iterations format)
 * @returns {boolean} True if password matches the stored hash
 * @throws {Error} If parameters are invalid
 *
 * @example
 * const hashed = hashPassword('myPassword123')
 * const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`
 * verifyPassword('myPassword123', stored) // Returns true
 * verifyPassword('wrongPassword', stored) // Returns false
 */
export function verifyPassword(password, storedHash) {
  if (typeof password !== 'string') {
    throw new TypeError('Password must be a string');
  }

  if (typeof storedHash !== 'string') {
    throw new TypeError('Stored hash must be a string');
  }

  const parts = storedHash.split(':');
  if (parts.length !== 3) {
    throw new Error(
      'Invalid stored hash format. Expected: hash:salt:iterations',
    );
  }

  const [hashPart, saltPart, iterationsPart] = parts;
  const iterations = parseInt(iterationsPart, 10);

  if (Number.isNaN(iterations)) {
    throw new Error('Invalid iterations value in stored hash');
  }

  try {
    const rehashed = hashPassword(password, saltPart, iterations);
    const storedHashBuffer = Buffer.from(hashPart, 'base64');
    const rehashedBuffer = Buffer.from(rehashed.hash, 'base64');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(storedHashBuffer, rehashedBuffer);
  } catch (error) {
    return false;
  }
}

/**
 * Hashes a password using a bcrypt-like algorithm (scrypt)
 * More computationally expensive than PBKDF2
 *
 * @param {string} password - The password to hash
 * @param {string} [salt] - Optional salt (generated if not provided)
 * @param {number} [cost=15] - Cost factor (higher = slower, 12-15 typical)
 * @returns {object} {hash, salt, cost} all as strings
 * @throws {Error} If password is invalid or cost is out of range
 *
 * @example
 * const result = hashPasswordBcrypt('myPassword123')
 * // Returns {
 * //   hash: 'base64EncodedHash',
 * //   salt: 'base64EncodedSalt',
 * //   cost: '15'
 * // }
 */
export function hashPasswordBcrypt(password, salt = null, cost = 15) {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password must be a non-empty string');
  }

  if (typeof cost !== 'number' || cost < 4 || cost > 31) {
    throw new Error('Cost must be a number between 4 and 31');
  }

  const useSalt = salt || generateSalt();
  const saltBuffer = Buffer.from(useSalt, 'base64');

  // Using scrypt as a bcrypt-like alternative
  // N = 2^cost gives us the computational cost
  const N = 2 ** cost;
  const r = 8;
  const p = 1;

  const hash = crypto.scryptSync(password, saltBuffer, 32, {
    N,
    r,
    p,
    maxmem: 64 * 1024 * 1024,
  });

  return {
    hash: hash.toString('base64'),
    salt: useSalt,
    cost: cost.toString(),
  };
}

/**
 * Verifies a password against a bcrypt-hashed value
 *
 * @param {string} password - The password to verify
 * @param {string} storedHash - The stored hash (hash:salt:cost format)
 * @returns {boolean} True if password matches
 * @throws {Error} If parameters are invalid
 *
 * @example
 * const hashed = hashPasswordBcrypt('myPassword123')
 * const stored = `${hashed.hash}:${hashed.salt}:${hashed.cost}`
 * verifyPasswordBcrypt('myPassword123', stored) // Returns true
 */
export function verifyPasswordBcrypt(password, storedHash) {
  if (typeof password !== 'string') {
    throw new TypeError('Password must be a string');
  }

  if (typeof storedHash !== 'string') {
    throw new TypeError('Stored hash must be a string');
  }

  const parts = storedHash.split(':');
  if (parts.length !== 3) {
    throw new Error(
      'Invalid stored hash format. Expected: hash:salt:cost',
    );
  }

  const [hashPart, saltPart, costPart] = parts;
  const cost = parseInt(costPart, 10);

  if (Number.isNaN(cost)) {
    throw new Error('Invalid cost value in stored hash');
  }

  try {
    const rehashed = hashPasswordBcrypt(password, saltPart, cost);
    const storedHashBuffer = Buffer.from(hashPart, 'base64');
    const rehashedBuffer = Buffer.from(rehashed.hash, 'base64');

    return crypto.timingSafeEqual(storedHashBuffer, rehashedBuffer);
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a password meets security requirements
 * Verifies minimum length, character variety, and strength
 *
 * @param {string} password - The password to check
 * @param {object} [options] - Validation options
 * @param {number} [options.minLength=8] - Minimum password length
 * @param {boolean} [options.requireUppercase=true] - Require uppercase letters
 * @param {boolean} [options.requireLowercase=true] - Require lowercase letters
 * @param {boolean} [options.requireNumbers=true] - Require numbers
 * @param {boolean} [options.requireSpecial=true] - Require special characters
 * @returns {object} {valid, errors, score} with validation details
 *
 * @example
 * checkPasswordStrength('Pass123!')
 * // Returns {
 * //   valid: true,
 * //   errors: [],
 * //   score: 100
 * // }
 * checkPasswordStrength('weak')
 * // Returns {
 * //   valid: false,
 * //   errors: ['Password too short', 'Missing uppercase...'],
 * //   score: 20
 * // }
 */
export function checkPasswordStrength(password, options = {}) {
  if (typeof password !== 'string') {
    throw new TypeError('Password must be a string');
  }

  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true,
  } = options;

  const errors = [];
  let score = 0;

  // Check length
  if (password.length < minLength) {
    errors.push(
      `Password must be at least ${minLength} characters long`,
    );
  } else {
    score += 25;
  }

  // Check uppercase
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 25;
  }

  // Check lowercase
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 25;
  }

  // Check numbers
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/\d/.test(password)) {
    score += 15;
  }

  // Check special characters
  if (
    requireSpecial
    && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  ) {
    errors.push(
      'Password must contain at least one special character (!@#$%^&*...)',
    );
  } else if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 10;
  }

  // Bonus for very long passwords
  if (password.length >= 16) {
    score = Math.min(score + 10, 100);
  }

  return {
    valid: errors.length === 0,
    errors,
    score: Math.min(score, 100),
  };
}

/**
 * Suggests improvements for a weak password
 *
 * @param {string} password - The password to analyze
 * @returns {Array<string>} Array of suggestions for improvement
 *
 * @example
 * suggestPasswordImprovements('weak')
 * // Returns [
 * //   'Add uppercase letters (A-Z)',
 * //   'Add numbers (0-9)',
 * //   'Add special characters (!@#$%)',
 * //   'Increase length to at least 8 characters'
 * // ]
 */
export function suggestPasswordImprovements(password) {
  if (typeof password !== 'string') {
    throw new TypeError('Password must be a string');
  }

  const suggestions = [];

  if (password.length < 8) {
    suggestions.push(
      `Increase length to at least 8 characters (currently ${password.length})`,
    );
  }

  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters (A-Z)');
  }

  if (!/[a-z]/.test(password)) {
    suggestions.push('Add lowercase letters (a-z)');
  }

  if (!/\d/.test(password)) {
    suggestions.push('Add numbers (0-9)');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    suggestions.push('Add special characters (!@#$%^&*...)');
  }

  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid repeating characters (aaa, 111, etc.)');
  }

  if (/^[0-9]+$/.test(password) || /^[a-z]+$/i.test(password)) {
    suggestions.push('Mix different types of characters');
  }

  return suggestions;
}

/**
 * Hashes a list of passwords (useful for batch operations)
 *
 * @param {Array<string>} passwords - Array of passwords to hash
 * @param {string} [algorithm='pbkdf2'] - Algorithm to use (pbkdf2 or bcrypt)
 * @returns {Array<object>} Array of {password, hash, salt, ...} objects
 *
 * @example
 * const passwords = ['pass1', 'pass2', 'pass3']
 * hashMultiplePasswords(passwords)
 * // Returns array of hashed password objects
 */
export function hashMultiplePasswords(passwords, algorithm = 'pbkdf2') {
  if (!Array.isArray(passwords)) {
    throw new TypeError('Passwords must be an array');
  }

  if (!['pbkdf2', 'bcrypt'].includes(algorithm)) {
    throw new Error('Algorithm must be "pbkdf2" or "bcrypt"');
  }

  return passwords.map((password) => {
    try {
      const hashed = algorithm === 'pbkdf2'
        ? hashPassword(password)
        : hashPasswordBcrypt(password);

      return {
        password: '***masked***',
        hash: hashed.hash,
        salt: hashed.salt,
        algorithm,
      };
    } catch (error) {
      return {
        password: '***masked***',
        error: error.message,
        algorithm,
      };
    }
  });
}
