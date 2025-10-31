/**
 * Text Obfuscator Implementation
 * Advanced text scrambling and obfuscation utilities
 * Provides multiple strategies: character substitution, reversal, homoglyph, leetspeak
 *
 * @module textObfuscator
 */

/**
 * Reverses a string character by character
 * Preserves spaces and punctuation in their original positions
 *
 * @param {string} text - The text to reverse
 * @returns {string} The reversed text
 * @throws {Error} If text is not a string
 *
 * @example
 * reverseText('Hello World')
 * // Returns 'dlroW olleH'
 */
export function reverseText(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  return text.split('').reverse().join('');
}

/**
 * Obfuscates text using character shifting (similar to Caesar cipher)
 * Each character is shifted by a fixed offset
 *
 * @param {string} text - The text to obfuscate
 * @param {number} [shift=5] - Number of positions to shift each character
 * @returns {string} The obfuscated text
 * @throws {Error} If text is not a string or shift is invalid
 *
 * @example
 * shiftCharacters('Hello', 3)
 * // Returns 'Khoor'
 */
export function shiftCharacters(text, shift = 5) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof shift !== 'number' || !Number.isInteger(shift)) {
    throw new Error('Shift must be an integer');
  }

  return text.split('').map((char) => {
    const code = char.charCodeAt(0);

    // Handle uppercase letters
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }

    // Handle lowercase letters
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }

    // Handle digits
    if (code >= 48 && code <= 57) {
      return String.fromCharCode(((code - 48 + shift) % 10) + 48);
    }

    // Return other characters unchanged
    return char;
  }).join('');
}

/**
 * Converts text to leetspeak/1337 speak
 * Replaces letters with visually similar numbers and symbols
 *
 * @param {string} text - The text to convert
 * @param {number} [intensity=1] - Intensity level (1-3, higher = more replacement)
 * @returns {string} The leetspeak text
 * @throws {Error} If text is not a string or intensity is invalid
 *
 * @example
 * toLeetspeak('Hello World')
 * // Returns 'H3ll0 W0rld' or similar depending on intensity
 */
export function toLeetspeak(text, intensity = 1) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (
    typeof intensity !== 'number'
    || intensity < 1
    || intensity > 3
    || !Number.isInteger(intensity)
  ) {
    throw new Error('Intensity must be an integer between 1 and 3');
  }

  // Basic replacements
  const basicReplacements = {
    A: '4',
    a: '4',
    E: '3',
    e: '3',
    I: '1',
    i: '1',
    O: '0',
    o: '0',
    S: '5',
    s: '5',
    T: '7',
    t: '7',
    L: '1',
    l: '1',
    G: '9',
    g: '9',
    B: '8',
    b: '8',
  };

  // Advanced replacements
  const advancedReplacements = {
    A: '4',
    a: '4',
    E: '3',
    e: '3',
    I: '1',
    i: '1',
    O: '0',
    o: '0',
    S: '5',
    s: '5',
    T: '7',
    t: '7',
    L: '1',
    l: '1',
    G: '9',
    g: '9',
    B: '8',
    b: '8',
    Z: '2',
    z: '2',
    X: '}{',
    x: '}{',
  };

  // Extreme replacements
  const extremeReplacements = {
    A: '4',
    a: '4',
    E: '3',
    e: '3',
    I: '1',
    i: '1',
    O: '0',
    o: '0',
    S: '5',
    s: '5',
    T: '7',
    t: '7',
    L: '1',
    l: '1',
    G: '9',
    g: '9',
    B: '8',
    b: '8',
    Z: '2',
    z: '2',
    X: '}{',
    x: '}{',
    H: '#',
    h: '#',
    M: '|//|',
    m: '|//|',
    W: '///',
    w: '///',
  };

  let result = text;
  let replacements = basicReplacements;

  if (intensity === 2) {
    replacements = advancedReplacements;
  } else if (intensity === 3) {
    replacements = extremeReplacements;
  }

  Object.entries(replacements).forEach(([char, replacement]) => {
    const regex = new RegExp(char, 'g');
    result = result.replace(regex, replacement);
  });

  return result;
}

/**
 * Reverses leetspeak back to normal text
 *
 * @param {string} text - The leetspeak text to decode
 * @returns {string} The decoded text
 * @throws {Error} If text is not a string
 *
 * @example
 * fromLeetspeak('H3ll0 W0rld')
 * // Returns 'Hello World'
 */
export function fromLeetspeak(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const reversals = {
    4: 'A',
    3: 'E',
    1: 'I',
    0: 'O',
    5: 'S',
    7: 'T',
    9: 'G',
    8: 'B',
    2: 'Z',
    '#': 'H',
  };

  let result = text.toUpperCase();
  Object.entries(reversals).forEach(([leet, char]) => {
    const regex = new RegExp(leet, 'g');
    result = result.replace(regex, char);
  });

  return result;
}

/**
 * Inserts random characters throughout the text for obfuscation
 *
 * @param {string} text - The text to obfuscate
 * @param {number} [density=0.2] - Ratio of inserted chars to original (0-1)
 * @returns {string} The obfuscated text with random chars
 * @throws {Error} If parameters are invalid
 *
 * @example
 * insertRandomCharacters('Hello', 0.3)
 * // Returns something like 'He@#llo'
 */
export function insertRandomCharacters(text, density = 0.2) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof density !== 'number' || density < 0 || density > 1) {
    throw new Error('Density must be a number between 0 and 1');
  }

  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let result = '';
  const charsToInsert = Math.floor(text.length * density);
  const insertPositions = new Set();

  // Generate random positions for insertion
  while (insertPositions.size < charsToInsert) {
    insertPositions.add(
      Math.floor(Math.random() * (text.length + charsToInsert)),
    );
  }

  let insertIndex = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (insertPositions.has(insertIndex)) {
      result += chars[Math.floor(Math.random() * chars.length)];
      insertIndex += 1;
    }
    result += text[i];
    insertIndex += 1;
  }

  return result;
}

/**
 * Replaces vowels with numbers while preserving text readability
 *
 * @param {string} text - The text to obfuscate
 * @param {boolean} [preserveCase=true] - Whether to preserve case in replacements
 * @returns {string} The obfuscated text
 * @throws {Error} If text is not a string
 *
 * @example
 * replaceVowels('Hello World')
 * // Returns 'H3ll0 W0rld'
 */
export function replaceVowels(text, preserveCase = true) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof preserveCase !== 'boolean') {
    throw new Error('preserveCase must be a boolean');
  }

  const vowelMap = {
    a: '4',
    A: '4',
    e: '3',
    E: '3',
    i: '1',
    I: '1',
    o: '0',
    O: '0',
    u: '@',
    U: '@',
  };

  return text.split('').map((char) => vowelMap[char] || char).join('');
}

/**
 * Reverses vowel replacements back to text
 *
 * @param {string} text - The obfuscated text
 * @returns {string} The decoded text
 * @throws {Error} If text is not a string
 *
 * @example
 * restoreVowels('H3ll0 W0rld')
 * // Returns 'Hello World'
 */
export function restoreVowels(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const reverseMap = {
    4: 'a',
    3: 'e',
    1: 'i',
    0: 'o',
    '@': 'u',
  };

  return text.split('').map((char) => reverseMap[char] || char).join('');
}

/**
 * Applies multiple obfuscation techniques sequentially
 * Creates a highly obfuscated version of text
 *
 * @param {string} text - The text to obfuscate
 * @param {Array<string>} [techniques] - Techniques to apply in order
 * @returns {string} The heavily obfuscated text
 * @throws {Error} If text is not a string or techniques are invalid
 *
 * @example
 * multiObfuscate('Hello World', ['reverse', 'leet', 'shift'])
 * // Returns highly obfuscated version using all three techniques
 */
export function multiObfuscate(
  text,
  techniques = ['reverse', 'vowels', 'leet'],
) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (!Array.isArray(techniques)) {
    throw new TypeError('Techniques must be an array');
  }

  const validTechniques = [
    'reverse',
    'vowels',
    'leet',
    'shift',
    'random',
  ];

  techniques.forEach((tech) => {
    if (!validTechniques.includes(tech)) {
      throw new Error(
        `Invalid technique: ${tech}. Must be one of: ${validTechniques.join(', ')}`,
      );
    }
  });

  let result = text;

  techniques.forEach((technique) => {
    switch (technique) {
      case 'reverse':
        result = reverseText(result);
        break;
      case 'vowels':
        result = replaceVowels(result);
        break;
      case 'leet':
        result = toLeetspeak(result, 2);
        break;
      case 'shift':
        result = shiftCharacters(result, 3);
        break;
      case 'random':
        result = insertRandomCharacters(result, 0.15);
        break;
      default:
        break;
    }
  });

  return result;
}

/**
 * Interleaves spaces or characters between original text
 *
 * @param {string} text - The text to obfuscate
 * @param {string} [separator=' '] - Character to interleave
 * @returns {string} The obfuscated text with interleaved characters
 * @throws {Error} If parameters are invalid
 *
 * @example
 * interleaveCharacters('Hello', '-')
 * // Returns 'H-e-l-l-o'
 */
export function interleaveCharacters(text, separator = ' ') {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof separator !== 'string') {
    throw new Error('Separator must be a string');
  }

  return text.split('').join(separator);
}

/**
 * Removes interleaved separator characters
 *
 * @param {string} text - The text with interleaved characters
 * @param {string} [separator=' '] - Character that was interleaved
 * @returns {string} The decoded text
 * @throws {Error} If parameters are invalid
 *
 * @example
 * deinterleaveCharacters('H-e-l-l-o', '-')
 * // Returns 'Hello'
 */
export function deinterleaveCharacters(text, separator = ' ') {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof separator !== 'string') {
    throw new Error('Separator must be a string');
  }

  // Escape special regex characters in separator
  const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSeparator, 'g');
  return text.replace(regex, '');
}

/**
 * Converts text to a confusable homoglyph variant
 * Replaces characters with visually similar Unicode characters
 *
 * @param {string} text - The text to convert
 * @returns {string} The homoglyph variant
 * @throws {Error} If text is not a string
 *
 * @example
 * toHomoglyph('Hello')
 * // Returns text that looks similar but uses different Unicode characters
 */
export function toHomoglyph(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  const homoglyphMap = {
    A: 'А', // Cyrillic A
    B: 'В', // Cyrillic B
    C: 'С', // Cyrillic C
    E: 'Е', // Cyrillic E
    H: 'Н', // Cyrillic H
    K: 'К', // Cyrillic K
    M: 'М', // Cyrillic M
    N: 'N', // Latin N (no change but for reference)
    O: 'О', // Cyrillic O
    P: 'Р', // Cyrillic R
    T: 'Т', // Cyrillic T
    X: 'Х', // Cyrillic H
    Y: 'У', // Cyrillic Y
    a: 'а', // Cyrillic a
    c: 'с', // Cyrillic c
    e: 'е', // Cyrillic e
    h: 'һ', // Cyrillic h
    o: 'о', // Cyrillic o
    p: 'р', // Cyrillic p
    x: 'х', // Cyrillic x
  };

  return text.split('').map((char) => homoglyphMap[char] || char).join('');
}

/**
 * Calculates obfuscation strength (0-100)
 * Based on techniques applied and transformations made
 *
 * @param {string} original - Original text
 * @param {string} obfuscated - Obfuscated text
 * @returns {number} Strength score from 0-100
 * @throws {Error} If parameters are invalid
 *
 * @example
 * const obf = multiObfuscate('Hello')
 * calculateObfuscationStrength('Hello', obf)
 * // Returns a score like 85
 */
export function calculateObfuscationStrength(original, obfuscated) {
  if (typeof original !== 'string' || typeof obfuscated !== 'string') {
    throw new TypeError('Both parameters must be strings');
  }

  let score = 0;

  // Same length (indicates good obfuscation)
  if (original.length === obfuscated.length) {
    score += 20;
  } else if (obfuscated.length > original.length) {
    score += 30; // Extra characters are harder to decode
  }

  // Character variety increased
  const originalChars = new Set(original);
  const obfuscatedChars = new Set(obfuscated);
  if (obfuscatedChars.size > originalChars.size) {
    score += 25;
  }

  // Different case pattern
  const hasCase = /[A-Z]/.test(original);
  const obfuscatedHasCase = /[A-Z]/.test(obfuscated);
  if (hasCase !== obfuscatedHasCase) {
    score += 15;
  }

  // Contains special characters or numbers
  if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(obfuscated)) {
    score += 25;
  }

  // Not similar to original
  if (original.toLowerCase() !== obfuscated.toLowerCase()) {
    score += 15;
  }

  return Math.min(score, 100);
}
