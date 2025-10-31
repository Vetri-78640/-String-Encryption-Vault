/**
 * Base64 Encoder/Decoder
 *
 * Base64 is a binary-to-text encoding scheme that represents binary data
 * in ASCII string format.
 *
 * Educational Value:
 * - Understand binary-to-text encoding
 * - Learn about character encoding
 * - Foundation for data transmission
 *
 * Security Notes:
 * - NOT ENCRYPTION - easily reversible
 * - Used for data format/transmission, not security
 * - Always ensure security layer above Base64
 */

class Base64Error extends Error {
  constructor(message = 'Base64 Error') {
    super(message);
    this.name = 'Base64Error';
  }
}

class InvalidBase64Error extends Base64Error {
  constructor(message = 'Invalid Base64 string') {
    super(message);
    this.name = 'InvalidBase64Error';
  }
}

/**
 * Encode text to Base64
 * @param {string} text - Text to encode
 * @returns {string} Base64 encoded string
 * @throws {TypeError} If text is not a string
 * @example
 * encode("HELLO"); // "SEVMTE8="
 * encode("HELLO WORLD"); // "SEVMTE8gV09STEQ="
 */
function encode(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  try {
    return Buffer.from(text, 'utf-8').toString('base64');
  } catch (e) {
    throw new Base64Error(`Encoding failed: ${e.message}`);
  }
}

/**
 * Decode Base64 text
 * @param {string} encodedText - Base64 encoded string
 * @returns {string} Decoded text
 * @throws {InvalidBase64Error} If Base64 string is invalid
 * @throws {TypeError} If input is not a string
 * @example
 * decode("SEVMTE8="); // "HELLO"
 * decode("SEVMTE8gV09STEQ="); // "HELLO WORLD"
 */
function decode(encodedText) {
  if (typeof encodedText !== 'string') {
    throw new TypeError('Encoded text must be a string');
  }

  try {
    return Buffer.from(encodedText, 'base64').toString('utf-8');
  } catch (e) {
    throw new InvalidBase64Error(`Decoding failed: ${e.message}`);
  }
}

/**
 * Check if string is valid Base64
 * @param {string} text - String to check
 * @returns {boolean} True if valid Base64
 * @example
 * isBase64("SEVMTE8="); // true
 * isBase64("HELLO"); // false
 */
function isBase64(text) {
  if (typeof text !== 'string') {
    return false;
  }

  try {
    const encoded = Buffer.from(text, 'base64').toString('base64');
    return encoded === text;
  } catch (e) {
    return false;
  }
}

/**
 * Analyze Base64 properties
 * @param {string} text - Text to analyze
 * @returns {Object} Analysis results
 * @example
 * analyze("SEVMTE8=");
 */
function analyze(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const encoded = encode(text);
  return {
    original: text,
    encoded,
    originalLength: text.length,
    encodedLength: encoded.length,
    bytesOriginal: Buffer.byteLength(text, 'utf-8'),
    padding: (encoded.match(/=/g) || []).length,
    isValidBase64: isBase64(encoded),
  };
}

export {
  encode,
  decode,
  isBase64,
  analyze,
  Base64Error,
  InvalidBase64Error,
};
