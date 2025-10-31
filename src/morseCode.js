/**
 * Morse Code Implementation
 * Encoder and decoder for Morse code with support for letters, numbers, punctuation
 * Supports multiple formats: dots/dashes, audio timing, and character separation
 *
 * @module morseCode
 */

// Morse code dictionary
const MORSE_CODE_DICT = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  0: '-----',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-...-',
  '(': '-.--.-',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  _: '..--.-',
  '"': '.-..-.',
  $: '...-..-',
  '@': '.--.-.',
  ' ': '/',
};

// Reverse dictionary for decoding
const REVERSE_MORSE_DICT = Object.entries(MORSE_CODE_DICT).reduce(
  (acc, [char, code]) => {
    acc[code] = char;
    return acc;
  },
  {},
);

/**
 * Converts text to Morse code
 * Each character is converted to its Morse representation
 * Characters are separated by spaces, words by ' / '
 *
 * @param {string} text - The text to convert
 * @param {string} [separator=' '] - Separator between characters
 * @returns {string} Morse code representation
 * @throws {Error} If text is not a string
 *
 * @example
 * textToMorse('Hello')
 * // Returns '.... . .-.. .-.. ---'
 */
export function textToMorse(text, separator = ' ') {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof separator !== 'string') {
    throw new Error('Separator must be a string');
  }

  return text
    .toUpperCase()
    .split('')
    .map((char) => MORSE_CODE_DICT[char] || '?')
    .join(separator);
}

/**
 * Converts Morse code to text
 * Morse characters should be separated by spaces, words by ' / '
 *
 * @param {string} morse - Morse code to decode
 * @param {string} [separator=' '] - Separator used between characters
 * @returns {string} Decoded text
 * @throws {Error} If morse is not a string
 *
 * @example
 * morseToText('.... . .-.. .-.. ---')
 * // Returns 'HELLO'
 */
export function morseToText(morse, separator = ' ') {
  if (typeof morse !== 'string') {
    throw new TypeError('Morse must be a string');
  }

  if (typeof separator !== 'string') {
    throw new Error('Separator must be a string');
  }

  return morse
    .split(separator)
    .map((code) => REVERSE_MORSE_DICT[code] || '?')
    .join('');
}

/**
 * Validates if a string is valid Morse code
 * Checks if all symbols are valid Morse characters (. - /)
 *
 * @param {string} morse - The Morse code to validate
 * @returns {boolean} True if valid Morse code
 * @throws {Error} If morse is not a string
 *
 * @example
 * isValidMorse('.... . .-.. .-.. ---')
 * // Returns true
 * isValidMorse('.... X .-.. .-.. ---')
 * // Returns false
 */
export function isValidMorse(morse) {
  if (typeof morse !== 'string') {
    throw new TypeError('Morse must be a string');
  }

  return /^[\s./-]*$/.test(morse);
}

/**
 * Gets the Morse code for a single character
 *
 * @param {string} char - Single character to convert
 * @returns {string} Morse code for the character
 * @throws {Error} If char is not a single character
 *
 * @example
 * charToMorse('A')
 * // Returns '.-'
 */
export function charToMorse(char) {
  if (typeof char !== 'string' || char.length !== 1) {
    throw new Error('Input must be a single character');
  }

  return MORSE_CODE_DICT[char.toUpperCase()] || '?';
}

/**
 * Gets the character for a Morse code sequence
 *
 * @param {string} morse - Morse code sequence (e.g., '.-')
 * @returns {string} The character represented by the Morse code
 * @throws {Error} If morse is not valid
 *
 * @example
 * morseToChar('.-')
 * // Returns 'A'
 */
export function morseToChar(morse) {
  if (typeof morse !== 'string') {
    throw new TypeError('Morse must be a string');
  }

  return REVERSE_MORSE_DICT[morse] || '?';
}

/**
 * Converts text to Morse code with word-level separation
 * Words are separated by ' / '
 *
 * @param {string} text - Text with words separated by spaces
 * @returns {string} Morse code with words separated by ' / '
 * @throws {Error} If text is not a string
 *
 * @example
 * textToMorseWords('Hello World')
 * // Returns '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'
 */
export function textToMorseWords(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  return text
    .split(' ')
    .map((word) => textToMorse(word, ' '))
    .join(' / ');
}

/**
 * Converts Morse code to text with word preservation
 * Words should be separated by ' / '
 *
 * @param {string} morse - Morse code with words separated by ' / '
 * @returns {string} Decoded text
 * @throws {Error} If morse is not a string
 *
 * @example
 * morseWordsToText('.... . .-.. .-.. --- / .-- --- .-. .-.. -..')
 * // Returns 'HELLO WORLD'
 */
export function morseWordsToText(morse) {
  if (typeof morse !== 'string') {
    throw new TypeError('Morse must be a string');
  }

  return morse
    .split(' / ')
    .map((word) => morseToText(word, ' '))
    .join(' ');
}

/**
 * Converts Morse code to audio-friendly format
 * Uses timing marks: unit (dot time), longer marks, and word gaps
 * '.' = short, '-' = long, '|' = char gap, '/' = word gap
 *
 * @param {string} text - Text to convert
 * @param {number} [speed=20] - Words per minute (affects timing)
 * @returns {string} Audio timing representation
 * @throws {Error} If parameters are invalid
 *
 * @example
 * getAudioTiming('Hi', 20)
 * // Returns timing representation
 */
export function getAudioTiming(text, speed = 20) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }

  if (typeof speed !== 'number' || speed < 5 || speed > 100) {
    throw new Error('Speed must be a number between 5 and 100 WPM');
  }

  // Calculate timing (PARIS standard: 20 WPM = 50ms per unit)
  const unitTime = (1200 / speed);

  const morse = textToMorse(text);
  const parts = morse.split(' ');

  return parts
    .map((code) => {
      if (code === '/') {
        return `(${Math.round(unitTime * 7)})`;
      }
      if (code === '') {
        return '';
      }

      let totalTime = 0;
      const codeSymbols = code.split('');

      codeSymbols.forEach((symbol, index) => {
        if (symbol === '.') {
          totalTime += unitTime;
        } else if (symbol === '-') {
          totalTime += unitTime * 3;
        }

        // Gap between elements
        if (index < codeSymbols.length - 1) {
          totalTime += unitTime;
        }
      });

      // Gap between characters
      if (code !== '/') {
        totalTime += unitTime * 3;
      }

      return `${code}(${Math.round(totalTime)})`;
    })
    .join('');
}

/**
 * Generates a frequency for audio playback (standard: 800 Hz)
 *
 * @param {string} morse - Morse code to generate audio info for
 * @param {number} [frequency=800] - Frequency in Hz
 * @param {number} [duration=1000] - Duration per dot in milliseconds
 * @returns {object} Audio configuration object
 * @throws {Error} If parameters are invalid
 *
 * @example
 * getAudioConfig('.... . .-.. .-.. ---', 800, 100)
 * // Returns {frequency: 800, duration: 100, pattern: [...]}
 */
export function getAudioConfig(morse, frequency = 800, duration = 100) {
  if (typeof morse !== 'string') {
    throw new TypeError('Morse must be a string');
  }

  if (
    typeof frequency !== 'number'
    || frequency < 100
    || frequency > 2000
  ) {
    throw new Error('Frequency must be between 100 and 2000 Hz');
  }

  if (typeof duration !== 'number' || duration < 10 || duration > 1000) {
    throw new Error('Duration must be between 10 and 1000 ms');
  }

  const pattern = morse.split(' ').map((code) => {
    if (code === '/') {
      return {
        type: 'silence',
        duration: duration * 7,
      };
    }

    const elements = code.split('').map((symbol) => ({
      type: symbol === '.' ? 'dit' : 'dah',
      duration: symbol === '.' ? duration : duration * 3,
    }));

    return {
      type: 'character',
      elements,
      gap: duration,
    };
  });

  return {
    frequency,
    duration,
    pattern,
  };
}

/**
 * Validates and corrects common Morse code errors
 * Fixes spacing and common substitutions
 *
 * @param {string} morse - Morse code to validate
 * @returns {object} {valid: boolean, corrected: string, errors: string[]}
 * @throws {Error} If morse is not a string
 *
 * @example
 * validateMorse('.... . .-.. .-.. ---')
 * // Returns {valid: true, corrected: '.... . .-.. .-.. ---', errors: []}
 */
export function validateMorse(morse) {
  if (typeof morse !== 'string') {
    throw new TypeError('Morse must be a string');
  }

  const errors = [];
  let corrected = morse;

  // Check for invalid characters
  const invalidChars = corrected.match(/[^.\s-/]/g);
  if (invalidChars && invalidChars.length > 0) {
    errors.push(
      `Invalid characters found: ${[...new Set(invalidChars)].join(', ')}`,
    );
  }

  // Fix multiple spaces
  if (/ {2,}/.test(corrected)) {
    errors.push('Multiple spaces detected - normalizing');
    corrected = corrected.replace(/ {2,}/g, ' ');
  }

  // Check for trailing/leading spaces
  if (/^ | $/.test(corrected)) {
    errors.push('Leading/trailing spaces detected - trimming');
    corrected = corrected.trim();
  }

  return {
    valid: errors.length === 0,
    corrected,
    errors,
  };
}

/**
 * Gets statistics about Morse code
 * Returns character count, dot/dash count, and efficiency
 *
 * @param {string} morse - Morse code to analyze
 * @returns {object} Statistics object with counts and metrics
 * @throws {Error} If morse is not a string
 *
 * @example
 * getMorseStats('.... . .-.. .-.. ---')
 * // Returns {dots: 7, dashes: 12, chars: 5, totalLength: 23}
 */
export function getMorseStats(morse) {
  if (typeof morse !== 'string') {
    throw new TypeError('Morse must be a string');
  }

  const dots = (morse.match(/\./g) || []).length;
  const dashes = (morse.match(/-/g) || []).length;
  const chars = (morse.match(/[.-]/g) || []).length;
  const words = (morse.match(/\//g) || []).length;
  const totalLength = morse.replace(/\s/g, '').length;

  return {
    dots,
    dashes,
    characters: chars,
    words,
    totalLength,
    dotDashRatio: dots > 0 ? (dashes / dots).toFixed(2) : 0,
  };
}

/**
 * Converts Morse code to alternative format with different symbols
 * Useful for displays that can't show dots and dashes
 *
 * @param {string} morse - Morse code to convert
 * @param {string} [shortSymbol='·']} - Symbol for dot
 * @param {string} [longSymbol='−']} - Symbol for dash
 * @returns {string} Morse code in alternative format
 * @throws {Error} If parameters are invalid
 *
 * @example
 * getMorseAlternative('.... . .-.. .-.. ---')
 * // Returns '···· · ·−·· ·−·· −−−'
 */
export function getMorseAlternative(morse, shortSymbol = '·', longSymbol = '−') {
  if (typeof morse !== 'string') {
    throw new TypeError('Morse must be a string');
  }

  if (typeof shortSymbol !== 'string' || typeof longSymbol !== 'string') {
    throw new Error('Symbols must be strings');
  }

  let result = morse;
  result = result.replaceAll('.', shortSymbol);
  result = result.replaceAll('-', longSymbol);
  return result;
}
