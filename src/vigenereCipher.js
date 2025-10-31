/**
 * Vigenère Cipher Implementation
 * A polyalphabetic substitution cipher using a keyword to generate multiple shift values
 * More secure than Caesar cipher but vulnerable to Kasiski examination and Friedman test
 *
 * @module vigenereCipher
 */

/**
 * Encrypts text using the Vigenère cipher
 * Each letter in the plaintext is shifted by the corresponding letter in the key
 * Non-alphabetic characters are preserved
 *
 * @param {string} plaintext - The text to encrypt
 * @param {string} key - The keyword to use for encryption (repeated as needed)
 * @returns {string} The encrypted text
 * @throws {Error} If plaintext or key is not a string or key is empty
 *
 * @example
 * encrypt('HELLOWORLD', 'KEY') // Returns 'RIJVSUYVJN'
 * encrypt('Hello World', 'SECRET') // Returns 'Zijjb Wbuog' (preserves case & spaces)
 */
export function encrypt(plaintext, key) {
  if (typeof plaintext !== 'string') {
    throw new TypeError('Plaintext must be a string');
  }
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Key must be a non-empty string');
  }

  const keyUpper = key.toUpperCase();
  let keyIndex = 0;
  let result = '';

  for (let i = 0; i < plaintext.length; i += 1) {
    const char = plaintext[i];
    const charCode = char.charCodeAt(0);

    if (/[A-Za-z]/.test(char)) {
      // Get the shift value from the key
      const keyChar = keyUpper[keyIndex % keyUpper.length];
      const shift = keyChar.charCodeAt(0) - 65; // A=0, B=1, ..., Z=25

      if (/[A-Z]/.test(char)) {
        // Uppercase letter
        const shifted = ((charCode - 65 + shift) % 26) + 65;
        result += String.fromCharCode(shifted);
      } else {
        // Lowercase letter
        const shifted = ((charCode - 97 + shift) % 26) + 97;
        result += String.fromCharCode(shifted);
      }

      keyIndex += 1;
    } else {
      // Non-alphabetic character, keep it as is
      result += char;
    }
  }

  return result;
}

/**
 * Decrypts text encrypted with the Vigenère cipher
 * Reverses the encryption by shifting backwards
 *
 * @param {string} ciphertext - The encrypted text
 * @param {string} key - The keyword used for encryption
 * @returns {string} The decrypted text
 * @throws {Error} If ciphertext or key is not a string or key is empty
 *
 * @example
 * decrypt('RIJVSUYVJN', 'KEY') // Returns 'HELLOWORLD'
 * decrypt('Zijjb Wbuog', 'SECRET') // Returns 'Hello World'
 */
export function decrypt(ciphertext, key) {
  if (typeof ciphertext !== 'string') {
    throw new TypeError('Ciphertext must be a string');
  }
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Key must be a non-empty string');
  }

  const keyUpper = key.toUpperCase();
  let keyIndex = 0;
  let result = '';

  for (let i = 0; i < ciphertext.length; i += 1) {
    const char = ciphertext[i];
    const charCode = char.charCodeAt(0);

    if (/[A-Za-z]/.test(char)) {
      // Get the shift value from the key
      const keyChar = keyUpper[keyIndex % keyUpper.length];
      const shift = keyChar.charCodeAt(0) - 65; // A=0, B=1, ..., Z=25

      if (/[A-Z]/.test(char)) {
        // Uppercase letter
        const shifted = ((charCode - 65 - shift + 26) % 26) + 65;
        result += String.fromCharCode(shifted);
      } else {
        // Lowercase letter
        const shifted = ((charCode - 97 - shift + 26) % 26) + 97;
        result += String.fromCharCode(shifted);
      }

      keyIndex += 1;
    } else {
      // Non-alphabetic character, keep it as is
      result += char;
    }
  }

  return result;
}

/**
 * Calculates a score for text based on English letter frequency
 *
 * @param {string} text - The text to analyze
 * @returns {number} A score based on letter frequency
 * @private
 */
function calculateTextScore(text) {
  const englishFrequency = {
    E: 11,
    T: 9,
    A: 8,
    O: 7.5,
    I: 7,
    N: 6.7,
    S: 6.3,
    H: 6.1,
    R: 6,
    D: 4.3,
    L: 4,
    C: 2.8,
    U: 2.8,
    M: 2.4,
    W: 2.4,
    F: 2.2,
    G: 2,
    Y: 2,
    P: 1.9,
    B: 1.5,
    V: 0.98,
    K: 0.77,
    J: 0.15,
    X: 0.15,
    Q: 0.1,
    Z: 0.07,
  };

  let score = 0;
  const textUpper = text.toUpperCase();

  textUpper.split('').forEach((char) => {
    if (/[A-Z]/.test(char)) {
      score += englishFrequency[char] || 0;
    }
  });

  return score;
}

/**
 * Performs a brute force attack by trying common English words as keys
 * Returns potential plaintexts with their scores
 *
 * @param {string} ciphertext - The encrypted text
 * @param {Array<string>} [commonWords] - Optional list of common words to try
 * @returns {Array<{key: string, plaintext: string, score: number}>}
 *   Potential decryptions sorted by score
 *
 * @example
 * bruteForce('RIJVSUYVJN', ['KEY', 'SECRET', 'PASSWORD'])
 * // Returns [{key: 'KEY', plaintext: 'HELLOWORLD', score: 8}, ...]
 */
export function bruteForce(ciphertext, commonWords = []) {
  if (typeof ciphertext !== 'string' || ciphertext.length === 0) {
    throw new Error('Ciphertext cannot be empty');
  }

  // Default common English words to try
  const defaultWords = [
    'PASSWORD',
    'SECRET',
    'KEY',
    'CIPHER',
    'ENCRYPT',
    'SECURITY',
    'COMPUTER',
    'ALGORITHM',
    'CRYPTOGRAPHY',
    'HASH',
    'SYMMETRIC',
    'ASYMMETRIC',
    'MESSAGE',
    'HELLO',
    'WORLD',
    'JAVASCRIPT',
    'HACKTOBERFEST',
    'CONTRIBUTE',
    'GITHUB',
    'VAULT',
    'CRYPTO',
  ];

  const wordsToTry = commonWords.length > 0 ? commonWords : defaultWords;
  const results = [];

  wordsToTry.forEach((word) => {
    try {
      const plaintext = decrypt(ciphertext, word);
      const score = calculateTextScore(plaintext);

      results.push({
        key: word,
        plaintext,
        score,
      });
    } catch (e) {
      // Ignore words that cause errors
    }
  });

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Gets all divisors of a number
 *
 * @param {number} num - The number to analyze
 * @returns {Array<number>} Array of divisors
 * @private
 */
function getDivisors(num) {
  const divisors = [];
  for (let i = 1; i <= Math.sqrt(num); i += 1) {
    if (num % i === 0) {
      divisors.push(i);
      if (i !== num / i) {
        divisors.push(num / i);
      }
    }
  }
  return divisors.sort((a, b) => a - b);
}

/**
 * Analyzes the ciphertext to find potential key length using Kasiski examination
 * Finds repeated sequences and their distances
 *
 * @param {string} ciphertext - The encrypted text
 * @param {number} [sequenceLength=3] - Length of sequences to look for
 * @returns {Object} Analysis results with key length guesses and distances
 *
 * @example
 * analyze('RIJVSUYVJNRIJVSUYVJN')
 * // Returns { keyLengths: [1, 2, 3, ...], distances: [...], likely: 2 }
 */
export function analyze(ciphertext, sequenceLength = 3) {
  if (typeof ciphertext !== 'string' || ciphertext.length < sequenceLength) {
    throw new Error('Ciphertext too short for analysis');
  }

  const sequences = new Map();
  const cipherUpper = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');

  // Find repeated sequences
  for (let i = 0; i <= cipherUpper.length - sequenceLength; i += 1) {
    const sequence = cipherUpper.substring(i, i + sequenceLength);
    if (sequences.has(sequence)) {
      sequences.get(sequence).push(i);
    } else {
      sequences.set(sequence, [i]);
    }
  }

  // Calculate distances between repetitions
  const distances = [];
  sequences.forEach((positions) => {
    if (positions.length > 1) {
      for (let i = 0; i < positions.length - 1; i += 1) {
        distances.push(positions[i + 1] - positions[i]);
      }
    }
  });

  // Find common factors (likely key lengths)
  const factors = new Map();
  distances.forEach((distance) => {
    const divisors = getDivisors(distance);
    divisors.forEach((divisor) => {
      factors.set(divisor, (factors.get(divisor) || 0) + 1);
    });
  });

  // Sort by frequency
  const keyLengths = Array.from(factors.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([length]) => length);

  return {
    keyLengths,
    distances: distances.slice(0, 10),
    likelyKeyLength: keyLengths[0] || null,
    repetitionCount: distances.length,
  };
}

/**
 * Checks if the given plaintext-ciphertext pair uses a valid Vigenère cipher
 * by verifying consistency of the encryption process
 *
 * @param {string} plaintext - The original text
 * @param {string} ciphertext - The encrypted text
 * @param {string} key - The key to verify
 * @returns {boolean} True if the pair is valid for this key
 *
 * @example
 * const pt = 'HELLO';
 * const ct = encrypt(pt, 'SECRET');
 * verify(pt, ct, 'SECRET') // Returns true
 */
export function verify(plaintext, ciphertext, key) {
  if (typeof plaintext !== 'string' || typeof ciphertext !== 'string' || typeof key !== 'string') {
    throw new TypeError('All parameters must be strings');
  }

  const encrypted = encrypt(plaintext, key);
  return encrypted.toUpperCase() === ciphertext.toUpperCase();
}

/**
 * Generates a random key of specified length
 *
 * @param {number} [length=8] - The length of the key to generate
 * @returns {string} A random alphabetic key
 *
 * @example
 * const key = generateKey(10) // Returns something like 'ABCDEFGHIJ'
 */
export function generateKey(length = 8) {
  if (typeof length !== 'number' || length < 1) {
    throw new Error('Key length must be a positive number');
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let key = '';

  for (let i = 0; i < length; i += 1) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return key;
}
