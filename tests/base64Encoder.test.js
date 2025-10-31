import {
  encode,
  decode,
  isBase64,
  analyze,
} from '../src/base64Encoder.js';

describe('Base64 Encoder', () => {
  describe('encode', () => {
    it('should encode text to base64', () => {
      expect(encode('HELLO')).toBe('SEVMTE8=');
    });

    it('should encode text with spaces', () => {
      expect(encode('HELLO WORLD')).toBe('SEVMTE8gV09STEQ==');
    });

    it('should encode empty string', () => {
      expect(encode('')).toBe('');
    });

    it('should encode special characters', () => {
      const result = encode('Hello, World!');
      expect(typeof result).toBe('string');
    });

    it('should handle unicode characters', () => {
      const result = encode('Hëllö');
      expect(typeof result).toBe('string');
    });

    it('should throw error for non-string', () => {
      expect(() => encode(123)).toThrow(TypeError);
      expect(() => encode(null)).toThrow(TypeError);
    });
  });

  describe('decode', () => {
    it('should decode base64 to text', () => {
      expect(decode('SEVMTE8=')).toBe('HELLO');
    });

    it('should decode base64 with spaces', () => {
      expect(decode('SEVMTE8gV09STEQ==')).toBe('HELLO WORLD');
    });

    it('should decode empty string', () => {
      expect(decode('')).toBe('');
    });

    it('should be inverse of encode', () => {
      const original = 'HELLO WORLD';
      const encoded = encode(original);
      expect(decode(encoded)).toBe(original);
    });

    it('should throw error for invalid base64', () => {
      expect(() => decode('!!!invalid!!!')).toThrow();
    });
  });

  describe('isBase64', () => {
    it('should return true for valid base64', () => {
      expect(isBase64('SEVMTE8=')).toBe(true);
    });

    it('should return false for invalid base64', () => {
      expect(isBase64('HELLO')).toBe(false);
    });

    it('should return false for non-string', () => {
      expect(isBase64(123)).toBe(false);
      expect(isBase64(null)).toBe(false);
    });
  });

  describe('analyze', () => {
    it('should analyze text properties', () => {
      const analysis = analyze('HELLO');
      expect(analysis.original).toBe('HELLO');
      expect(analysis.encoded).toBe('SEVMTE8=');
      expect(analysis.originalLength).toBe(5);
      expect(analysis.padding).toBe(1);
    });
  });
});
