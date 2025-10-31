/**
 * Caesar Cipher
 *
 * A simple shift cipher where each letter is shifted by a fixed number.
 *
 * Educational Value:
 * - Understand basic substitution ciphers
 * - Learn about modular arithmetic
 * - Foundation for understanding cryptography
 *
 * Security Notes:
 * - NOT SECURE - only 26 possible keys
 * - Easily broken by frequency analysis
 * - Use only for educational purposes
 */

class CaesarCipherError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CaesarCipherError';
  }
}

class InvalidShiftError extends CaesarCipherError {
  constructor(message = 'Shift must be between 1 and 25') {
    super(message);
    this.name = 'InvalidShiftError';
  }
}

/**
 * Validate shift value
 * @private
 * @param {number} shift - Shift value to validate
 * @throws {InvalidShiftError} If shift is invalid
 */
function validateShift(shift) {
  if (!Number.isInteger(shift)) {
    throw new InvalidShiftError('Shift must be an integer');
  }
  if (shift < 1 || shift > 25) {
    throw new InvalidShiftError();
  }
}

/**
 * Encrypt plaintext using Caesar Cipher
 * @param {string} plaintext - Text to encrypt
 * @param {number} [shift=3] - Number of positions to shift (1-25)
 * @returns {string} Encrypted text
 * @throws {InvalidShiftError} If shift is invalid
 * @throws {TypeError} If plaintext is not a string
 * @example
 * encrypt("HELLO", 3); // "KHOOR"
 * encrypt("hello", 3); // "khoor"
 */
function encrypt(plaintext, shift = 3) {
  if (typeof plaintext !== 'string') {
    throw new TypeError('Plaintext must be a string');
  }

  validateShift(shift);

  return plaintext
    .split('')
    .map((char) => {
      if (/[a-z]/.test(char)) {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      if (/[A-Z]/.test(char)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      return char;
    })
    .join('');
}

/**
 * Decrypt ciphertext using Caesar Cipher
 * @param {string} ciphertext - Text to decrypt
 * @param {number} [shift=3] - Number of positions shifted (1-25)
 * @returns {string} Decrypted text
 * @throws {InvalidShiftError} If shift is invalid
 * @throws {TypeError} If ciphertext is not a string
 * @example
 * decrypt("KHOOR", 3); // "HELLO"
 * decrypt("khoor", 3); // "hello"
 */
function decrypt(ciphertext, shift = 3) {
  if (typeof ciphertext !== 'string') {
    throw new TypeError('Ciphertext must be a string');
  }

  validateShift(shift);

  // Decryption is encryption with negative shift
  return encrypt(ciphertext, 26 - shift);
}

/**
 * Try all possible shifts to decrypt
 * @param {string} ciphertext - Text to decrypt
 * @returns {Object} Dictionary mapping shift values to possible plaintexts
 * @example
 * bruteForce("KHOOR")[3]; // "HELLO"
 */
function bruteForce(ciphertext) {
  if (typeof ciphertext !== 'string') {
    throw new TypeError('Ciphertext must be a string');
  }

  const results = {};
  for (let shift = 1; shift < 26; shift += 1) {
    try {
      results[shift] = decrypt(ciphertext, shift);
    } catch (e) {
      // Skip invalid shifts
    }
  }

  return results;
}

/**
 * Analyze text for Caesar Cipher properties
 * @param {string} text - Text to analyze
 * @returns {Object} Analysis results including letter frequency
 * @example
 * analyze("HELLO WORLD");
 * // { totalChars: 11, letters: 10, vowels: 3, ... }
 */
function analyze(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const textUpper = text.toUpperCase();
  const letters = text.split('').filter((c) => /[a-zA-Z]/.test(c));
  const vowels = letters.filter((c) => /[aeiouAEIOU]/.test(c));
  const consonants = letters.filter((c) => !/[aeiouAEIOU]/.test(c));

  return {
    totalChars: text.length,
    letters: letters.length,
    vowels: vowels.length,
    consonants: consonants.length,
    uppercase: text.split('').filter((c) => /[A-Z]/.test(c)).length,
    lowercase: text.split('').filter((c) => /[a-z]/.test(c)).length,
    nonAlphabetic: text.length - letters.length,
  };
}

export {
  encrypt,
  decrypt,
  bruteForce,
  analyze,
  CaesarCipherError,
  InvalidShiftError,
};
