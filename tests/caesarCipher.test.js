import {
  encrypt,
  decrypt,
  bruteForce,
  analyze,
  InvalidShiftError,
} from '../src/caesarCipher.js';

describe('Caesar Cipher', () => {
  describe('encrypt', () => {
    it('should encrypt with default shift of 3', () => {
      expect(encrypt('HELLO')).toBe('KHOOR');
    });

    it('should encrypt with custom shift', () => {
      expect(encrypt('HELLO', 5)).toBe('MJQQT');
    });

    it('should preserve case', () => {
      expect(encrypt('Hello', 3)).toBe('Khoor');
    });

    it('should preserve non-alphabetic characters', () => {
      expect(encrypt('HELLO, WORLD!', 3)).toBe('KHOOR, ZRUOG!');
    });

    it('should handle empty string', () => {
      expect(encrypt('', 3)).toBe('');
    });

    it('should wrap around alphabet', () => {
      expect(encrypt('XYZ', 3)).toBe('ABC');
    });

    it('should throw error for invalid shift', () => {
      expect(() => encrypt('HELLO', 0)).toThrow(InvalidShiftError);
      expect(() => encrypt('HELLO', 26)).toThrow(InvalidShiftError);
      expect(() => encrypt('HELLO', -1)).toThrow(InvalidShiftError);
    });

    it('should throw error for non-integer shift', () => {
      expect(() => encrypt('HELLO', 3.5)).toThrow(InvalidShiftError);
      expect(() => encrypt('HELLO', 'three')).toThrow(InvalidShiftError);
    });

    it('should throw error for non-string input', () => {
      expect(() => encrypt(123, 3)).toThrow(TypeError);
      expect(() => encrypt(null, 3)).toThrow(TypeError);
    });
  });

  describe('decrypt', () => {
    it('should decrypt with default shift of 3', () => {
      expect(decrypt('KHOOR')).toBe('HELLO');
    });

    it('should decrypt with custom shift', () => {
      expect(decrypt('MJQQT', 5)).toBe('HELLO');
    });

    it('should preserve case', () => {
      expect(decrypt('Khoor', 3)).toBe('Hello');
    });

    it('should preserve non-alphabetic characters', () => {
      expect(decrypt('KHOOR, ZRUOG!', 3)).toBe('HELLO, WORLD!');
    });

    it('should be inverse of encrypt', () => {
      const original = 'HELLO WORLD';
      const encrypted = encrypt(original, 7);
      expect(decrypt(encrypted, 7)).toBe(original);
    });
  });

  describe('bruteForce', () => {
    it('should find all possible decryptions', () => {
      const results = bruteForce('KHOOR');
      expect(results[3]).toBe('HELLO');
    });

    it('should return object with 25 shifts', () => {
      const results = bruteForce('KHOOR');
      expect(Object.keys(results).length).toBe(25);
    });
  });

  describe('analyze', () => {
    it('should analyze text properties', () => {
      const analysis = analyze('HELLO WORLD');
      expect(analysis.totalChars).toBe(11);
      expect(analysis.letters).toBe(10);
      expect(analysis.vowels).toBe(3);
    });

    it('should count uppercase and lowercase', () => {
      const analysis = analyze('Hello World');
      expect(analysis.uppercase).toBe(2);
      expect(analysis.lowercase).toBe(8);
    });

    it('should count non-alphabetic characters', () => {
      const analysis = analyze('HELLO, WORLD!');
      expect(analysis.nonAlphabetic).toBe(3);
    });
  });
});
