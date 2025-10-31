import {
  encrypt,
  decrypt,
  bruteForce,
  analyze,
  verify,
  generateKey
} from '../src/vigenereCipher.js';

describe('Vigenère Cipher', () => {
  describe('encrypt', () => {
    it('should encrypt text with a simple key', () => {
      expect(encrypt('HELLOWORLD', 'KEY')).toBe('RIJVSUYVJN');
    });

    it('should encrypt text with repeated key', () => {
      expect(encrypt('ATTACK', 'LIME')).toBe('LBFENS');
    });

    it('should preserve spaces', () => {
      expect(encrypt('HELLO WORLD', 'KEY')).toBe('RIJVS UYVJN');
    });

    it('should preserve punctuation', () => {
      expect(encrypt('HELLO, WORLD!', 'KEY')).toBe('RIJVS, UYVJN!');
    });

    it('should handle lowercase letters', () => {
      expect(encrypt('hello world', 'key')).toBe('rijvs uyvjn');
    });

    it('should handle mixed case', () => {
      expect(encrypt('Hello World', 'KEY')).toBe('Rijvs Uyvjn');
    });

    it('should handle single character encryption', () => {
      expect(encrypt('A', 'Z')).toBe('Z');
    });

    it('should handle numbers (preserve them)', () => {
      expect(encrypt('HELLO123', 'KEY')).toBe('RIJVS123');
    });

    it('should work with long key', () => {
      const encrypted = encrypt('THEQUICKBROWNFOX', 'VERYLONGKEY');
      expect(encrypted).toHaveLength(16);
    });

    it('should throw error for non-string plaintext', () => {
      expect(() => encrypt(123, 'KEY')).toThrow(TypeError);
    });

    it('should throw error for empty key', () => {
      expect(() => encrypt('HELLO', '')).toThrow(Error);
    });

    it('should throw error for non-string key', () => {
      expect(() => encrypt('HELLO', 123)).toThrow(Error);
    });
  });

  describe('decrypt', () => {
    it('should decrypt encrypted text', () => {
      const plaintext = 'HELLOWORLD';
      const ciphertext = encrypt(plaintext, 'KEY');
      expect(decrypt(ciphertext, 'KEY')).toBe(plaintext);
    });

    it('should decrypt with various keys', () => {
      const plaintext = 'ATTACKATDAWN';
      const keys = ['LIME', 'SECRET', 'CRYPTOGRAPHY'];

      for (const key of keys) {
        const ciphertext = encrypt(plaintext, key);
        expect(decrypt(ciphertext, key)).toBe(plaintext);
      }
    });

    it('should preserve spacing in decryption', () => {
      const plaintext = 'HELLO WORLD';
      const key = 'KEY';
      const ciphertext = encrypt(plaintext, key);
      expect(decrypt(ciphertext, key)).toBe(plaintext);
    });

    it('should handle mixed case decryption', () => {
      const plaintext = 'Hello World';
      const key = 'KEY';
      const ciphertext = encrypt(plaintext, key);
      expect(decrypt(ciphertext, key)).toBe(plaintext);
    });

    it('should throw error for non-string ciphertext', () => {
      expect(() => decrypt(123, 'KEY')).toThrow(TypeError);
    });

    it('should throw error for empty key', () => {
      expect(() => decrypt('RIJVS', '')).toThrow(Error);
    });

    it('should be inverse of encrypt', () => {
      const original = 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG';
      const key = 'SECRETKEY';
      const encrypted = encrypt(original, key);
      const decrypted = decrypt(encrypted, key);
      expect(decrypted).toBe(original);
    });
  });

  describe('bruteForce', () => {
    it('should find the key from common words', () => {
      const plaintext = 'HELLOWORLD';
      const key = 'KEY';
      const ciphertext = encrypt(plaintext, key);
      const results = bruteForce(ciphertext, [key]);

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].key).toBe(key);
    });

    it('should return results sorted by score', () => {
      const ciphertext = 'RIJVSUYVJN';
      const results = bruteForce(ciphertext, ['KEY', 'SECRET', 'PASSWORD']);

      for (let i = 0; i < results.length - 1; i += 1) {
        expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
      }
    });

    it('should handle empty word list with defaults', () => {
      const plaintext = 'HELLO';
      const ciphertext = encrypt(plaintext, 'PASSWORD');
      const results = bruteForce(ciphertext);

      expect(results.length).toBeGreaterThan(0);
    });

    it('should throw error for empty ciphertext', () => {
      expect(() => bruteForce('')).toThrow(Error);
    });

    it('should include plaintext in results', () => {
      const ciphertext = 'RIJVSUYVJN';
      const results = bruteForce(ciphertext, ['KEY']);

      expect(results[0]).toHaveProperty('plaintext');
      expect(results[0]).toHaveProperty('score');
    });
  });

  describe('analyze', () => {
    it('should return analysis object with expected properties', () => {
      const ciphertext = 'RIJVSUYVJNRIJVSUYVJN';
      const analysis = analyze(ciphertext);

      expect(analysis).toHaveProperty('keyLengths');
      expect(analysis).toHaveProperty('distances');
      expect(analysis).toHaveProperty('likelyKeyLength');
      expect(analysis).toHaveProperty('repetitionCount');
    });

    it('should find repeated patterns', () => {
      const key = 'AB';
      const plaintext = 'THETHETHETHETHETHETHEHE';
      const ciphertext = encrypt(plaintext, key);
      const analysis = analyze(ciphertext, 3);

      expect(analysis.keyLengths).toContain(2);
    });

    it('should handle different sequence lengths', () => {
      const ciphertext = 'RIJVSUYVJNRIJVSUYVJN';
      const analysis3 = analyze(ciphertext, 3);
      const analysis4 = analyze(ciphertext, 4);

      expect(analysis3).toHaveProperty('keyLengths');
      expect(analysis4).toHaveProperty('keyLengths');
    });

    it('should throw error for too short ciphertext', () => {
      expect(() => analyze('AB', 5)).toThrow(Error);
    });

    it('should handle ciphertext with no repetitions', () => {
      const ciphertext = 'ABCDEFGHIJKLMNOPQRST';
      const analysis = analyze(ciphertext);

      expect(analysis.keyLengths).toBeDefined();
    });
  });

  describe('verify', () => {
    it('should return true for correct key', () => {
      const plaintext = 'HELLOWORLD';
      const key = 'SECRET';
      const ciphertext = encrypt(plaintext, key);

      expect(verify(plaintext, ciphertext, key)).toBe(true);
    });

    it('should return false for incorrect key', () => {
      const plaintext = 'HELLOWORLD';
      const ciphertext = encrypt(plaintext, 'SECRET');

      expect(verify(plaintext, ciphertext, 'WRONGKEY')).toBe(false);
    });

    it('should be case insensitive', () => {
      const plaintext = 'HELLO';
      const key = 'KEY';
      const ciphertext = encrypt(plaintext, key);

      expect(verify(plaintext, ciphertext.toLowerCase(), key)).toBe(true);
    });

    it('should throw error for non-string parameters', () => {
      expect(() => verify(123, 'RIJVS', 'KEY')).toThrow(TypeError);
      expect(() => verify('HELLO', 123, 'KEY')).toThrow(TypeError);
      expect(() => verify('HELLO', 'RIJVS', 123)).toThrow(TypeError);
    });
  });

  describe('generateKey', () => {
    it('should generate a key of specified length', () => {
      const key = generateKey(10);
      expect(key).toHaveLength(10);
    });

    it('should generate only alphabetic characters', () => {
      for (let i = 0; i < 10; i += 1) {
        const key = generateKey(20);
        expect(/^[A-Z]+$/.test(key)).toBe(true);
      }
    });

    it('should generate different keys', () => {
      const key1 = generateKey(10);
      const key2 = generateKey(10);
      // They should usually be different (with very high probability)
      expect(key1).not.toBe(key2);
    });

    it('should use default length of 8', () => {
      const key = generateKey();
      expect(key).toHaveLength(8);
    });

    it('should throw error for invalid length', () => {
      expect(() => generateKey(0)).toThrow(Error);
      expect(() => generateKey(-5)).toThrow(Error);
      expect(() => generateKey('10')).toThrow(Error);
    });

    it('should generate valid keys for encryption', () => {
      for (let i = 0; i < 5; i += 1) {
        const key = generateKey(8);
        const encrypted = encrypt('HELLO', key);
        const decrypted = decrypt(encrypted, key);
        expect(decrypted).toBe('HELLO');
      }
    });
  });

  describe('Encryption/Decryption Roundtrip', () => {
    it('should handle roundtrip with spaces and punctuation', () => {
      const original = 'The quick brown fox, jumps over the lazy dog!';
      const key = 'MYSTERIOUSKEY';
      const encrypted = encrypt(original, key);
      const decrypted = decrypt(encrypted, key);

      expect(decrypted).toBe(original);
    });

    it('should handle roundtrip with numbers', () => {
      const original = 'Code123ABC456DEF';
      const key = 'NUMERIC';
      const encrypted = encrypt(original, key);
      const decrypted = decrypt(encrypted, key);

      expect(decrypted).toBe(original);
    });

    it('should handle very long texts', () => {
      const original = 'A'.repeat(1000);
      const key = 'LONGKEY';
      const encrypted = encrypt(original, key);
      const decrypted = decrypt(encrypted, key);

      expect(decrypted).toBe(original);
      expect(decrypted).toHaveLength(1000);
    });

    it('should handle all ASCII alphabetic characters', () => {
      const original = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const key = 'KEY';
      const encrypted = encrypt(original, key);
      const decrypted = decrypt(encrypted, key);

      expect(decrypted).toBe(original);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single character plaintext', () => {
      expect(encrypt('A', 'KEY')).toHaveLength(1);
      expect(decrypt(encrypt('A', 'KEY'), 'KEY')).toBe('A');
    });

    it('should handle single character key', () => {
      const encrypted = encrypt('HELLO', 'A');
      expect(encrypted).toBe('HELLO'); // Shift by 0
    });

    it('should handle plaintext with only spaces', () => {
      expect(encrypt('   ', 'KEY')).toBe('   ');
    });

    it('should handle plaintext with only non-alphabetic', () => {
      expect(encrypt('123!@#', 'KEY')).toBe('123!@#');
    });

    it('should handle very long key', () => {
      const key = 'A'.repeat(100);
      const encrypted = encrypt('HELLO', key);
      const decrypted = decrypt(encrypted, key);
      expect(decrypted).toBe('HELLO');
    });
  });
});
