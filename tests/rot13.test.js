import {
  encode,
  decode,
  isRot13Symmetric,
  analyze,
} from '../src/rot13.js';

describe('ROT13', () => {
  describe('encode', () => {
    it('should encode uppercase text', () => {
      expect(encode('HELLO')).toBe('URYYB');
    });

    it('should encode lowercase text', () => {
      expect(encode('hello')).toBe('uryyb');
    });

    it('should preserve non-alphabetic characters', () => {
      expect(encode('HELLO, WORLD!')).toBe('URYYB, JBEYQ!');
    });

    it('should handle mixed case', () => {
      expect(encode('Hello World')).toBe('Uryyb Jbeyq');
    });

    it('should be self-inverse', () => {
      const text = 'HELLO WORLD';
      expect(encode(encode(text))).toBe(text);
    });

    it('should throw error for non-string', () => {
      expect(() => encode(123)).toThrow(TypeError);
      expect(() => encode(null)).toThrow(TypeError);
    });
  });

  describe('decode', () => {
    it('should decode uppercase text', () => {
      expect(decode('URYYB')).toBe('HELLO');
    });

    it('should decode lowercase text', () => {
      expect(decode('uryyb')).toBe('hello');
    });

    it('should be identical to encode (self-inverse)', () => {
      expect(decode('HELLO')).toBe(encode('HELLO'));
    });
  });

  describe('isRot13Symmetric', () => {
    it('should return false for most text', () => {
      expect(isRot13Symmetric('HELLO')).toBe(false);
    });

    it('should detect symmetric text', () => {
      // Find text where ROT13 symmetry exists
      const text = 'NON';
      expect(isRot13Symmetric(encode(text))).toBe(true);
    });
  });

  describe('analyze', () => {
    it('should analyze text properties', () => {
      const analysis = analyze('HELLO');
      expect(analysis.original).toBe('HELLO');
      expect(analysis.encoded).toBe('URYYB');
      expect(analysis.length).toBe(5);
      expect(analysis.letters).toBe(5);
    });
  });
});
