/**
 * ROT13 Encoder/Decoder
 *
 * ROT13 is a simple letter substitution cipher that replaces a letter with
 * the 13th letter after it in the alphabet.
 *
 * Educational Value:
 * - Special case of Caesar Cipher (shift=13)
 * - Demonstrates symmetry in ciphers
 * - Simple obfuscation technique
 *
 * Security Notes:
 * - NOT SECURE - trivial to break
 * - ROT13(ROT13(x)) = x (self-inverse)
 * - Used only for obfuscation
 */

class ROT13Error extends Error {
  constructor(message = 'ROT13 Error') {
    super(message);
    this.name = 'ROT13Error';
  }
}

/**
 * Encode text using ROT13
 *
 * ROT13 is its own inverse, so encoding and decoding are the same operation.
 * @param {string} text - Text to encode
 * @returns {string} ROT13 encoded text
 * @throws {TypeError} If text is not a string
 * @example
 * encode("HELLO"); // "URYYB"
 * encode("URYYB"); // "HELLO"
 */
function encode(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  return text
    .split('')
    .map((char) => {
      if (/[a-z]/.test(char)) {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + 13) % 26) + 97);
      }
      if (/[A-Z]/.test(char)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + 13) % 26) + 65);
      }
      return char;
    })
    .join('');
}

/**
 * Decode ROT13 text
 *
 * Since ROT13 is self-inverse, this is identical to encode()
 * @param {string} text - Text to decode
 * @returns {string} Decoded text
 * @throws {TypeError} If text is not a string
 * @example
 * decode("URYYB"); // "HELLO"
 */
function decode(text) {
  // ROT13 is symmetric - applying it twice gives the original
  return encode(text);
}

/**
 * Check if text is symmetric under ROT13
 * @param {string} text - Text to check
 * @returns {boolean} True if encode(encode(text)) === text
 * @example
 * isRot13Symmetric("HELLO"); // false
 */
function isRot13Symmetric(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  return encode(encode(text)) === text;
}

/**
 * Analyze text for ROT13 properties
 * @param {string} text - Text to analyze
 * @returns {Object} Analysis results
 * @example
 * analyze("HELLO WORLD");
 */
function analyze(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const encoded = encode(text);
  return {
    original: text,
    encoded,
    isSymmetric: isRot13Symmetric(text),
    length: text.length,
    letters: text.split('').filter((c) => /[a-zA-Z]/.test(c)).length,
  };
}

export {
  encode,
  decode,
  isRot13Symmetric,
  analyze,
  ROT13Error,
};
