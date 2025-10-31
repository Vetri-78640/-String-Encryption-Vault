/**
 * Morse Code Tests
 * Comprehensive test suite for Morse code functionality
 */

import {
  textToMorse,
  morseToText,
  isValidMorse,
  charToMorse,
  morseToChar,
  textToMorseWords,
  morseWordsToText,
  getAudioTiming,
  getAudioConfig,
  validateMorse,
  getMorseStats,
  getMorseAlternative,
} from '../src/morseCode.js';

describe('Morse Code', () => {
  describe('textToMorse', () => {
    it('should convert text to Morse code', () => {
      const result = textToMorse('A');
      expect(result).toBe('.-');
    });

    it('should convert multiple characters', () => {
      const result = textToMorse('AB');
      expect(result).toBe('.- -...');
    });

    it('should handle uppercase conversion', () => {
      const result1 = textToMorse('hello');
      const result2 = textToMorse('HELLO');
      expect(result1).toBe(result2);
    });

    it('should handle numbers', () => {
      const result = textToMorse('123');
      expect(result).toContain('-');
      expect(result).toContain('.');
    });

    it('should handle punctuation', () => {
      const result = textToMorse('.');
      expect(result).toBe('.-.-.-');
    });

    it('should use custom separator', () => {
      const result = textToMorse('AB', '|');
      expect(result).toBe('.-|-...');
    });

    it('should throw error for non-string', () => {
      expect(() => textToMorse(123)).toThrow();
    });
  });

  describe('morseToText', () => {
    it('should convert Morse to text', () => {
      const result = morseToText('.-');
      expect(result).toBe('A');
    });

    it('should convert multiple characters', () => {
      const result = morseToText('.- -...');
      expect(result).toBe('AB');
    });

    it('should be inverse of textToMorse', () => {
      const original = 'HELLO';
      const morse = textToMorse(original);
      const decoded = morseToText(morse);
      expect(decoded).toBe(original);
    });

    it('should use custom separator', () => {
      const morse = textToMorse('AB', '|');
      const result = morseToText(morse, '|');
      expect(result).toBe('AB');
    });

    it('should throw error for non-string', () => {
      expect(() => morseToText(123)).toThrow();
    });
  });

  describe('isValidMorse', () => {
    it('should validate correct Morse code', () => {
      expect(isValidMorse('.- -...')).toBe(true);
    });

    it('should reject invalid characters', () => {
      expect(isValidMorse('.- X -...')).toBe(false);
    });

    it('should accept spaces and slashes', () => {
      expect(isValidMorse('.- / -...')).toBe(true);
    });

    it('should handle empty string', () => {
      expect(isValidMorse('')).toBe(true);
    });

    it('should throw error for non-string', () => {
      expect(() => isValidMorse(123)).toThrow();
    });
  });

  describe('charToMorse', () => {
    it('should convert single character', () => {
      expect(charToMorse('A')).toBe('.-');
      expect(charToMorse('B')).toBe('-...');
    });

    it('should handle uppercase conversion', () => {
      expect(charToMorse('a')).toBe('.-');
    });

    it('should handle numbers', () => {
      expect(charToMorse('5')).toBe('.....');
    });

    it('should return ? for unknown char', () => {
      expect(charToMorse('•')).toBe('?');
    });

    it('should throw error for multiple chars', () => {
      expect(() => charToMorse('AB')).toThrow();
    });

    it('should throw error for non-string', () => {
      expect(() => charToMorse(123)).toThrow();
    });
  });

  describe('morseToChar', () => {
    it('should convert Morse to character', () => {
      expect(morseToChar('.-')).toBe('A');
      expect(morseToChar('-...')).toBe('B');
    });

    it('should return ? for invalid code', () => {
      expect(morseToChar('...-.-')).toBe('?');
    });

    it('should throw error for non-string', () => {
      expect(() => morseToChar(123)).toThrow();
    });
  });

  describe('textToMorseWords', () => {
    it('should convert with word separation', () => {
      const result = textToMorseWords('Hi There');
      expect(result).toContain(' / ');
    });

    it('should handle multiple words', () => {
      const result = textToMorseWords('The Quick Brown');
      expect(result.split(' / ').length).toBe(3);
    });

    it('should throw error for non-string', () => {
      expect(() => textToMorseWords(123)).toThrow();
    });
  });

  describe('morseWordsToText', () => {
    it('should decode word-separated Morse', () => {
      const morse = textToMorseWords('Hello World');
      const result = morseWordsToText(morse);
      expect(result).toContain('HELLO');
      expect(result).toContain('WORLD');
    });

    it('should preserve word boundaries', () => {
      const morse = textToMorseWords('Hi There');
      const result = morseWordsToText(morse);
      expect(result).toBe('HI THERE');
    });

    it('should throw error for non-string', () => {
      expect(() => morseWordsToText(123)).toThrow();
    });
  });

  describe('getAudioTiming', () => {
    it('should generate timing information', () => {
      const result = getAudioTiming('A', 20);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle different speeds', () => {
      const slow = getAudioTiming('A', 10);
      const fast = getAudioTiming('A', 40);
      expect(slow).toBeDefined();
      expect(fast).toBeDefined();
    });

    it('should throw error for invalid speed', () => {
      expect(() => getAudioTiming('A', 0)).toThrow();
      expect(() => getAudioTiming('A', 150)).toThrow();
    });

    it('should throw error for non-string', () => {
      expect(() => getAudioTiming(123, 20)).toThrow();
    });
  });

  describe('getAudioConfig', () => {
    it('should generate audio configuration', () => {
      const config = getAudioConfig('.- -...', 800, 100);
      expect(config.frequency).toBe(800);
      expect(config.duration).toBe(100);
      expect(config.pattern).toBeDefined();
      expect(Array.isArray(config.pattern)).toBe(true);
    });

    it('should handle custom frequency', () => {
      const config = getAudioConfig('.-', 1200, 100);
      expect(config.frequency).toBe(1200);
    });

    it('should handle custom duration', () => {
      const config = getAudioConfig('.-', 800, 200);
      expect(config.duration).toBe(200);
    });

    it('should throw error for invalid frequency', () => {
      expect(() => getAudioConfig('.-', 50, 100)).toThrow();
      expect(() => getAudioConfig('.-', 3000, 100)).toThrow();
    });

    it('should throw error for invalid duration', () => {
      expect(() => getAudioConfig('.-', 800, 5)).toThrow();
      expect(() => getAudioConfig('.-', 800, 2000)).toThrow();
    });
  });

  describe('validateMorse', () => {
    it('should validate correct Morse', () => {
      const result = validateMorse('.- -...');
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should detect invalid characters', () => {
      const result = validateMorse('.- X -...');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fix multiple spaces', () => {
      const result = validateMorse('.-  -...');
      expect(result.corrected).not.toContain('  ');
    });

    it('should trim leading/trailing spaces', () => {
      const result = validateMorse(' .- -... ');
      expect(result.corrected).toEqual(result.corrected.trim());
    });

    it('should throw error for non-string', () => {
      expect(() => validateMorse(123)).toThrow();
    });
  });

  describe('getMorseStats', () => {
    it('should calculate statistics', () => {
      const stats = getMorseStats('.... . .-.. .-.. ---');
      expect(stats.dots).toBeGreaterThan(0);
      expect(stats.dashes).toBeGreaterThan(0);
      expect(stats.characters).toBeGreaterThan(0);
    });

    it('should count characters correctly', () => {
      const stats = getMorseStats('.-');
      expect(stats.characters).toBe(2);
    });

    it('should calculate dot/dash ratio', () => {
      const stats = getMorseStats('.... . .-.. .-.. ---');
      expect(stats.dotDashRatio).toBeDefined();
      expect(typeof stats.dotDashRatio).toBe('string');
    });

    it('should count words', () => {
      const stats = getMorseStats('.- / -...');
      expect(stats.words).toBe(1);
    });

    it('should throw error for non-string', () => {
      expect(() => getMorseStats(123)).toThrow();
    });
  });

  describe('getMorseAlternative', () => {
    it('should convert to alternative symbols', () => {
      const result = getMorseAlternative('.-');
      expect(result).not.toContain('.');
      expect(result).not.toContain('-');
    });

    it('should use custom symbols', () => {
      const result = getMorseAlternative('.-', 'X', 'Y');
      expect(result).toBe('XY');
    });

    it('should handle complex Morse', () => {
      const result = getMorseAlternative('.... . .-.. .-.. ---');
      expect(result).toBeDefined();
    });

    it('should throw error for non-string morse', () => {
      expect(() => getMorseAlternative(123, '·', '−')).toThrow();
    });

    it('should throw error for invalid symbols', () => {
      expect(() => getMorseAlternative('.-', 123, '−')).toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should complete encode-decode cycle', () => {
      const original = 'HELLO WORLD';
      const morse = textToMorseWords(original);
      const decoded = morseWordsToText(morse);
      expect(decoded).toBe(original);
    });

    it('should handle all English characters', () => {
      const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const morse = textToMorse(text);
      const decoded = morseToText(morse);
      expect(decoded).toBe(text);
    });

    it('should handle numbers correctly', () => {
      const text = '0123456789';
      const morse = textToMorse(text);
      const decoded = morseToText(morse);
      expect(decoded).toBe(text);
    });

    it('should handle mixed content', () => {
      const text = 'HELLO123!';
      const morse = textToMorse(text);
      expect(isValidMorse(morse)).toBe(true);
    });

    it('should validate all conversions', () => {
      const morse = textToMorse('SOS');
      expect(isValidMorse(morse)).toBe(true);
      const stats = getMorseStats(morse);
      expect(stats.characters).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = textToMorse('');
      expect(result).toBe('');
    });

    it('should handle single character', () => {
      const result = textToMorse('A');
      expect(result).toBe('.-');
    });

    it('should handle long text', () => {
      const text = 'HELLO WORLD '.repeat(100);
      const morse = textToMorse(text);
      expect(morse).toBeDefined();
    });

    it('should handle punctuation combinations', () => {
      const text = '.,?!';
      const morse = textToMorse(text);
      expect(isValidMorse(morse)).toBe(true);
    });

    it('should handle spaces between words', () => {
      const morse = textToMorseWords('A B C');
      expect(morse.split(' / ').length).toBe(3);
    });

    it('should handle very long Morse code', () => {
      const longMorse = '.- '.repeat(1000);
      expect(isValidMorse(longMorse)).toBe(true);
    });

    it('should handle alternative format', () => {
      const morse = '.... . .-.. .-.. ---';
      const alt = getMorseAlternative(morse);
      // Unicode symbols '·' and '−' may have different byte lengths
      expect(alt).toContain('·');
      expect(alt).toContain('−');
      expect(alt).not.toContain('.');
      expect(alt).not.toContain('-');
    });

    it('should calculate stats for complex input', () => {
      const morse = '.... . .-.. .-.. --- / .-- --- .-. .-.. -..';
      const stats = getMorseStats(morse);
      expect(stats.words).toBe(1);
      expect(stats.totalLength).toBeGreaterThan(0);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should encode SOS signal', () => {
      const result = textToMorse('SOS');
      expect(result).toBeDefined();
      expect(isValidMorse(result)).toBe(true);
    });

    it('should handle call sign', () => {
      const callSign = 'W5XYZ';
      const morse = textToMorse(callSign);
      const decoded = morseToText(morse);
      expect(decoded).toBe(callSign);
    });

    it('should handle message with punctuation', () => {
      const message = 'HELLO, HOW ARE YOU?';
      const morse = textToMorse(message);
      expect(isValidMorse(morse)).toBe(true);
    });

    it('should generate valid audio config for message', () => {
      const message = textToMorse('MORSE');
      const config = getAudioConfig(message);
      expect(config.pattern.length).toBeGreaterThan(0);
    });
  });
});
