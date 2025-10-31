/**
 * Braille Converter Module
 * Converts text to Braille (Unicode U+2800-U+28FF) and back
 * Uses standard Grade 1 (uncontracted) Braille patterns
 *
 * @module brailleConverter
 * @author Vetri
 */

// Braille Unicode pattern mapping (U+2800 = empty cell)
// Each Braille character is represented as a 6-dot pattern
// Dots are numbered:
//   1 4
//   2 5
//   3 6

const BRAILLE_DICT = {
  A: '⠁', // 1
  B: '⠃', // 1,2
  C: '⠉', // 1,4
  D: '⠙', // 1,4,5
  E: '⠑', // 1,5
  F: '⠋', // 1,2,4
  G: '⠛', // 1,2,4,5
  H: '⠓', // 1,2,5
  I: '⠊', // 2,4
  J: '⠚', // 2,4,5
  K: '⠅', // 1,3
  L: '⠇', // 1,2,3
  M: '⠍', // 1,3,4
  N: '⠝', // 1,3,4,5
  O: '⠕', // 1,3,5
  P: '⠏', // 1,2,3,4
  Q: '⠟', // 1,2,3,4,5
  R: '⠗', // 1,2,3,5
  S: '⠎', // 2,3,4
  T: '⠞', // 2,3,4,5
  U: '⠥', // 1,3,6
  V: '⠧', // 1,2,3,6
  W: '⠺', // 2,4,5,6
  X: '⠭', // 1,3,4,6
  Y: '⠽', // 1,3,4,5,6
  Z: '⠵', // 1,3,5,6

  // Numbers (with number prefix ⠼)
  0: '⠼⠴', // number prefix + 3,4,5,6
  1: '⠼⠁', // number prefix + 1
  2: '⠼⠃', // number prefix + 1,2
  3: '⠼⠉', // number prefix + 1,4
  4: '⠼⠙', // number prefix + 1,4,5
  5: '⠼⠑', // number prefix + 1,5
  6: '⠼⠋', // number prefix + 1,2,4
  7: '⠼⠛', // number prefix + 1,2,4,5
  8: '⠼⠓', // number prefix + 1,2,5
  9: '⠼⠚', // number prefix + 2,4,5

  // Common punctuation
  '.': '⠸', // 3,4,5,6
  ',': '⠐', // 4
  ';': '⠰', // 5,6
  ':': '⠱', // 5,6,3
  '!': '⠮', // 1,3,4,6
  '?': '⠹', // 1,4,5,6
  "'": '⠄', // 3
  '"': '⠂', // 2,3
  '(': '⠶', // 3,4,5,6,2
  ')': '⠾', // 3,4,5,6,3,4
  '-': '⠤', // 3,6
  '/': '⠸⠌', // dot 4,5,6 + slash
  '&': '⠯', // 1,2,3,4,5,6
  '@': '⠜', // 4,5,6,3
  '#': '⠼', // number prefix
  $: '⠲', // 2,3,4,5
  '%': '⠪', // 2,4,5,6
  '*': '⠻', // 1,2,4,5,6
  '+': '⠬', // 2,3,6
  '=': '⠿', // 1,2,3,4,5,6
  ' ': '⠀', // empty cell (space)
  _: '⠠', // capital letter indicator
};

// Reverse mapping for Braille to text
const REVERSE_BRAILLE_DICT = {};
Object.entries(BRAILLE_DICT).forEach(([char, braille]) => {
  REVERSE_BRAILLE_DICT[braille] = char;
});

/**
 * Converts text to Braille
 * Supports letters (A-Z), numbers (0-9), and common punctuation
 *
 * @param {string} text - Text to convert to Braille
 * @returns {string} Braille representation
 * @throws {TypeError} If text is not a string
 *
 * @example
 * textToBraille('HELLO')
 * // Returns '⠓⠑⠇⠇⠕'
 *
 * @example
 * textToBraille('HELLO WORLD')
 * // Returns '⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙'
 */
export function textToBraille(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  return text
    .toUpperCase()
    .split('')
    .map((char) => BRAILLE_DICT[char] || '?')
    .join('');
}

/**
 * Converts Braille to text
 * Decodes Braille Unicode characters back to readable text
 *
 * @param {string} braille - Braille text to decode
 * @returns {string} Decoded text
 * @throws {TypeError} If braille is not a string
 *
 * @example
 * brailleToText('⠓⠑⠇⠇⠕')
 * // Returns 'HELLO'
 */
export function brailleToText(braille) {
  if (typeof braille !== 'string') {
    throw new TypeError('Braille must be a string');
  }

  return braille
    .split('')
    .map((char) => REVERSE_BRAILLE_DICT[char] || '?')
    .join('');
}

/**
 * Converts a single character to Braille
 *
 * @param {string} char - Single character to convert
 * @returns {string} Braille representation of character
 * @throws {TypeError} If char is not a string or has length > 1
 *
 * @example
 * charToBraille('A')
 * // Returns '⠁'
 */
export function charToBraille(char) {
  if (typeof char !== 'string') {
    throw new TypeError('Character must be a string');
  }

  if (char.length !== 1) {
    throw new Error('Must provide a single character');
  }

  const upper = char.toUpperCase();
  return BRAILLE_DICT[upper] || '?';
}

/**
 * Converts a single Braille character to text
 *
 * @param {string} brailleChar - Single Braille character to convert
 * @returns {string} Text representation
 * @throws {TypeError} If brailleChar is not a string
 *
 * @example
 * brailleToChar('⠁')
 * // Returns 'A'
 */
export function brailleToChar(brailleChar) {
  if (typeof brailleChar !== 'string') {
    throw new TypeError('Braille character must be a string');
  }

  return REVERSE_BRAILLE_DICT[brailleChar] || '?';
}

/**
 * Checks if text is valid Braille (all characters map to known Braille)
 *
 * @param {string} text - Text to check
 * @returns {boolean} True if all characters have Braille equivalents
 * @throws {TypeError} If text is not a string
 *
 * @example
 * isValidBrailleText('HELLO')
 * // Returns true
 *
 * @example
 * isValidBrailleText('HELLO©')
 * // Returns false
 */
export function isValidBrailleText(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  return text.toUpperCase().split('').every((char) => BRAILLE_DICT[char] !== undefined);
}

/**
 * Checks if Braille text is valid (all characters are known Braille patterns)
 *
 * @param {string} braille - Braille text to check
 * @returns {boolean} True if all characters are recognized Braille
 * @throws {TypeError} If braille is not a string
 *
 * @example
 * isValidBraille('⠓⠑⠇⠇⠕')
 * // Returns true
 */
export function isValidBraille(braille) {
  if (typeof braille !== 'string') {
    throw new TypeError('Braille must be a string');
  }

  return braille.split('').every((char) => REVERSE_BRAILLE_DICT[char] !== undefined);
}

/**
 * Gets statistics about Braille text
 *
 * @param {string} braille - Braille text to analyze
 * @returns {object} Statistics object
 * @returns {number} stats.length - Total characters in Braille
 * @returns {number} stats.words - Number of words (separated by space)
 * @returns {number} stats.validChars - Number of recognized Braille characters
 * @returns {number} stats.invalidChars - Number of unrecognized characters
 * @throws {TypeError} If braille is not a string
 *
 * @example
 * getBrailleStats('⠓⠑⠇⠇⠕ ⠺⠕⠗⠇⠙')
 * // Returns { length: 11, words: 2, validChars: 11, invalidChars: 0 }
 */
export function getBrailleStats(braille) {
  if (typeof braille !== 'string') {
    throw new TypeError('Braille must be a string');
  }

  const chars = braille.split('');
  const validChars = chars.filter((c) => REVERSE_BRAILLE_DICT[c] !== undefined).length;
  const invalidChars = chars.length - validChars;
  const words = braille.split('⠀').filter((w) => w.length > 0).length;

  return {
    length: braille.length,
    words,
    validChars,
    invalidChars,
  };
}

/**
 * Gets statistics about text to be converted to Braille
 *
 * @param {string} text - Text to analyze
 * @returns {object} Statistics object
 * @returns {number} stats.length - Total characters
 * @returns {number} stats.words - Number of words
 * @returns {number} stats.letters - Number of letters (A-Z)
 * @returns {number} stats.numbers - Number of digits (0-9)
 * @returns {number} stats.punctuation - Number of punctuation marks
 * @returns {number} stats.spaces - Number of spaces
 * @throws {TypeError} If text is not a string
 *
 * @example
 * getTextStats('HELLO WORLD')
 * // Returns { length: 11, words: 2, letters: 10, numbers: 0, punctuation: 0, spaces: 1 }
 */
export function getTextStats(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const upper = text.toUpperCase();
  const letters = (upper.match(/[A-Z]/g) || []).length;
  const numbers = (upper.match(/[0-9]/g) || []).length;
  const punctuation = (upper.match(/[.,:;!?"'()\-/@&#$%*+=]/g) || []).length;
  const spaces = (upper.match(/ /g) || []).length;
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;

  return {
    length: text.length,
    words,
    letters,
    numbers,
    punctuation,
    spaces,
  };
}

/**
 * Validates and fixes Braille text (replaces unknown chars with '?')
 * Returns new string with invalid characters marked
 *
 * @param {string} braille - Braille text to validate
 * @returns {object} Validation result
 * @returns {string} result.fixed - Fixed Braille text
 * @returns {array} result.errors - Array of error indices
 * @returns {boolean} result.isValid - Whether all characters are valid
 * @throws {TypeError} If braille is not a string
 *
 * @example
 * validateBraille('⠓⠑HELLO⠇⠕')
 * // Returns { fixed: '⠓⠑????⠇⠕', errors: [2, 3, 4, 5], isValid: false }
 */
export function validateBraille(braille) {
  if (typeof braille !== 'string') {
    throw new TypeError('Braille must be a string');
  }

  const chars = braille.split('');
  const errors = [];
  const fixed = chars
    .map((char, idx) => {
      if (REVERSE_BRAILLE_DICT[char] === undefined) {
        errors.push(idx);
        return '?';
      }
      return char;
    })
    .join('');

  return {
    fixed,
    errors,
    isValid: errors.length === 0,
  };
}

/**
 * Validates and fixes text before Braille conversion
 * Returns new string with unsupported characters marked
 *
 * @param {string} text - Text to validate
 * @returns {object} Validation result
 * @returns {string} result.fixed - Fixed text
 * @returns {array} result.errors - Array of error indices
 * @returns {boolean} result.isValid - Whether all characters are valid
 * @throws {TypeError} If text is not a string
 *
 * @example
 * validateText('HELLO©WORLD')
 * // Returns { fixed: 'HELLO?WORLD', errors: [5], isValid: false }
 */
export function validateText(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const upper = text.toUpperCase();
  const chars = upper.split('');
  const errors = [];
  const fixed = chars
    .map((char, idx) => {
      if (BRAILLE_DICT[char] === undefined) {
        errors.push(idx);
        return '?';
      }
      return char;
    })
    .join('');

  return {
    fixed,
    errors,
    isValid: errors.length === 0,
  };
}

/**
 * Converts text to Braille with word separation
 * Each word is separated by a space (⠀) in Braille
 *
 * @param {string} text - Text to convert (words separated by spaces)
 * @returns {string} Braille with word separation
 * @throws {TypeError} If text is not a string
 *
 * @example
 * textToBrailleWords('HELLO WORLD')
 * // Returns '⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙'
 */
export function textToBrailleWords(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  return text
    .toUpperCase()
    .split(' ')
    .map((word) => word
      .split('')
      .map((char) => BRAILLE_DICT[char] || '?')
      .join(''))
    .join('⠀');
}

/**
 * Converts Braille back to text with word separation
 * Treats ⠀ (space) as word separator
 *
 * @param {string} braille - Braille text to convert
 * @returns {string} Text with word separation
 * @throws {TypeError} If braille is not a string
 *
 * @example
 * brailleWordsToText('⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙')
 * // Returns 'HELLO WORLD'
 */
export function brailleWordsToText(braille) {
  if (typeof braille !== 'string') {
    throw new TypeError('Braille must be a string');
  }

  return braille
    .split('⠀')
    .map((word) => word
      .split('')
      .map((char) => REVERSE_BRAILLE_DICT[char] || '?')
      .join(''))
    .join(' ');
}

/**
 * Gets a list of all supported characters
 *
 * @returns {object} Object with arrays of supported characters
 * @returns {array} result.letters - All supported letters
 * @returns {array} result.numbers - All supported numbers
 * @returns {array} result.punctuation - All supported punctuation
 *
 * @example
 * getSupportedCharacters()
 * // Returns { letters: ['A', 'B', ...], numbers: ['0', '1', ...], punctuation: ['.', ',', ...] }
 */
export function getSupportedCharacters() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbers = '0123456789'.split('');
  const punctuation = [
    '.', ',', ';', ':', '!', '?', "'", '"', '(', ')',
    '-', '/', '&', '@', '#', '$', '%', '*', '+', '=',
  ];

  return {
    letters,
    numbers,
    punctuation,
  };
}

/**
 * Converts Braille to ASCII art representation (for visualization)
 * Shows the dot pattern as dots and spaces
 *
 * @param {string} braille - Single Braille character
 * @returns {string} ASCII art representation (2 lines, 3 chars each)
 * @throws {TypeError} If braille is not a string with length 1
 *
 * @example
 * brailleToAscii('⠁')
 * // Returns '⠀·⠀\n⠀⠀⠀' (dot pattern)
 */
export function brailleToAscii(braille) {
  if (typeof braille !== 'string' || braille.length !== 1) {
    throw new TypeError('Input must be a single Braille character');
  }

  // Get Unicode code point
  const code = braille.charCodeAt(0) - 0x2800;

  // Dots in Braille are numbered 1-6:
  //   1 4
  //   2 5
  //   3 6
  // eslint-disable-next-line no-bitwise
  const dots = {
    // eslint-disable-next-line no-bitwise
    1: (code & 0x01) !== 0,
    // eslint-disable-next-line no-bitwise
    2: (code & 0x02) !== 0,
    // eslint-disable-next-line no-bitwise
    3: (code & 0x04) !== 0,
    // eslint-disable-next-line no-bitwise
    4: (code & 0x08) !== 0,
    // eslint-disable-next-line no-bitwise
    5: (code & 0x10) !== 0,
    // eslint-disable-next-line no-bitwise
    6: (code & 0x20) !== 0,
  };

  const line1 = `${dots[1] ? '⠿' : '⠀'}${dots[4] ? '⠿' : '⠀'}`;
  const line2 = `${dots[2] ? '⠿' : '⠀'}${dots[5] ? '⠿' : '⠀'}`;
  const line3 = `${dots[3] ? '⠿' : '⠀'}${dots[6] ? '⠿' : '⠀'}`;

  return `${line1}\n${line2}\n${line3}`;
}

/**
 * Gets the dot pattern for a Braille character
 * Returns which dots are raised (1-6)
 *
 * @param {string} braille - Single Braille character
 * @returns {array} Array of dot numbers that are raised
 * @throws {TypeError} If braille is not a string with length 1
 *
 * @example
 * getBrailleDotPattern('⠁')
 * // Returns [1]
 *
 * @example
 * getBrailleDotPattern('⠃')
 * // Returns [1, 2]
 */
export function getBrailleDotPattern(braille) {
  if (typeof braille !== 'string' || braille.length !== 1) {
    throw new TypeError('Input must be a single Braille character');
  }

  const code = braille.charCodeAt(0) - 0x2800;
  const dots = [];

  // eslint-disable-next-line no-bitwise
  if ((code & 0x01) !== 0) dots.push(1);
  // eslint-disable-next-line no-bitwise
  if ((code & 0x02) !== 0) dots.push(2);
  // eslint-disable-next-line no-bitwise
  if ((code & 0x04) !== 0) dots.push(3);
  // eslint-disable-next-line no-bitwise
  if ((code & 0x08) !== 0) dots.push(4);
  // eslint-disable-next-line no-bitwise
  if ((code & 0x10) !== 0) dots.push(5);
  // eslint-disable-next-line no-bitwise
  if ((code & 0x20) !== 0) dots.push(6);

  return dots;
}
