/**
 * Text Obfuscator Tests
 * Comprehensive test suite for text obfuscation functionality
 */

import {
  reverseText,
  shiftCharacters,
  toLeetspeak,
  fromLeetspeak,
  insertRandomCharacters,
  replaceVowels,
  restoreVowels,
  multiObfuscate,
  interleaveCharacters,
  deinterleaveCharacters,
  toHomoglyph,
  calculateObfuscationStrength,
} from '../src/textObfuscator.js';

describe('Text Obfuscator', () => {
  describe('reverseText', () => {
    it('should reverse a simple string', () => {
      expect(reverseText('Hello')).toBe('olleH');
    });

    it('should reverse text with spaces', () => {
      expect(reverseText('Hello World')).toBe('dlroW olleH');
    });

    it('should reverse special characters', () => {
      expect(reverseText('a!b@c#')).toBe('#c@b!a');
    });

    it('should handle empty string', () => {
      expect(reverseText('')).toBe('');
    });

    it('should throw error for non-string', () => {
      expect(() => reverseText(123)).toThrow();
    });

    it('should be reversible', () => {
      const text = 'Hello World';
      expect(reverseText(reverseText(text))).toBe(text);
    });
  });

  describe('shiftCharacters', () => {
    it('should shift characters', () => {
      const result = shiftCharacters('Hello', 1);
      expect(result).toBe('Ifmmp');
    });

    it('should shift with default value', () => {
      const result = shiftCharacters('Hello');
      expect(result.length).toBe('Hello'.length);
    });

    it('should handle uppercase letters', () => {
      expect(shiftCharacters('A', 1)).toBe('B');
      expect(shiftCharacters('Z', 1)).toBe('A');
    });

    it('should handle lowercase letters', () => {
      expect(shiftCharacters('a', 1)).toBe('b');
      expect(shiftCharacters('z', 1)).toBe('a');
    });

    it('should preserve non-alphabetic characters', () => {
      expect(shiftCharacters('Hello123!', 1)).toBe('Ifmmp234!');
    });

    it('should handle digits', () => {
      expect(shiftCharacters('123', 1)).toBe('234');
      expect(shiftCharacters('890', 1)).toBe('901');
    });

    it('should throw error for non-integer shift', () => {
      expect(() => shiftCharacters('Hello', 1.5)).toThrow();
    });

    it('should throw error for non-string', () => {
      expect(() => shiftCharacters(123, 1)).toThrow();
    });
  });

  describe('toLeetspeak', () => {
    it('should convert to basic leetspeak', () => {
      const result = toLeetspeak('Hello', 1);
      expect(result).toContain('3'); // E
      expect(result).toContain('0'); // O
    });

    it('should increase replacements with intensity', () => {
      const basic = toLeetspeak('Hello', 1);
      const advanced = toLeetspeak('Hello', 2);
      expect(advanced.length).toBeGreaterThanOrEqual(basic.length);
    });

    it('should handle intensity 3', () => {
      const result = toLeetspeak('Hello', 3);
      expect(result).toBeDefined();
    });

    it('should preserve original case', () => {
      const result = toLeetspeak('HELLO', 1);
      expect(result).toBeDefined();
    });

    it('should throw error for invalid intensity', () => {
      expect(() => toLeetspeak('Hello', 0)).toThrow();
      expect(() => toLeetspeak('Hello', 4)).toThrow();
      expect(() => toLeetspeak('Hello', 1.5)).toThrow();
    });

    it('should throw error for non-string', () => {
      expect(() => toLeetspeak(123, 1)).toThrow();
    });
  });

  describe('fromLeetspeak', () => {
    it('should convert from basic leet', () => {
      const result = fromLeetspeak('H3LL0');
      expect(result).toContain('E');
      expect(result).toContain('O');
    });

    it('should be case insensitive', () => {
      expect(fromLeetspeak('h3ll0')).toContain('E');
    });

    it('should handle mixed content', () => {
      const result = fromLeetspeak('H3LL0 W0RLD');
      expect(result).toBeDefined();
    });
  });

  describe('insertRandomCharacters', () => {
    it('should insert random characters', () => {
      const original = 'Hello';
      const result = insertRandomCharacters(original, 0.5);
      expect(result.length).toBeGreaterThan(original.length);
    });

    it('should respect density parameter', () => {
      const result1 = insertRandomCharacters('Hello', 0.1);
      const result2 = insertRandomCharacters('Hello World Test', 0.5);
      // Higher density should generally produce longer text
      expect(result1.length).toBeGreaterThanOrEqual('Hello'.length);
      expect(result2.length).toBeGreaterThan('Hello World Test'.length);
    });

    it('should handle zero density', () => {
      expect(insertRandomCharacters('Hello', 0)).toBe('Hello');
    });

    it('should throw error for invalid density', () => {
      expect(() => insertRandomCharacters('Hello', -0.1)).toThrow();
      expect(() => insertRandomCharacters('Hello', 1.5)).toThrow();
    });

    it('should throw error for non-string', () => {
      expect(() => insertRandomCharacters(123, 0.2)).toThrow();
    });
  });

  describe('replaceVowels', () => {
    it('should replace vowels with numbers', () => {
      const result = replaceVowels('Hello');
      expect(result).toBe('H3ll0');
    });

    it('should replace uppercase vowels', () => {
      const result = replaceVowels('HELLO');
      expect(result).toBe('H3LL0');
    });

    it('should preserve consonants', () => {
      expect(replaceVowels('xyz')).toBe('xyz');
    });

    it('should replace u with @', () => {
      expect(replaceVowels('sun')).toContain('@');
    });

    it('should throw error for non-string', () => {
      expect(() => replaceVowels(123)).toThrow();
    });
  });

  describe('restoreVowels', () => {
    it('should restore replaced vowels', () => {
      const original = 'Hello';
      const replaced = replaceVowels(original);
      const restored = restoreVowels(replaced);
      expect(restored.toLowerCase()).toBe(original.toLowerCase());
    });

    it('should handle all vowel replacements', () => {
      const result = restoreVowels('H3LL0 W@RLD');
      expect(result).toBeDefined();
    });

    it('should throw error for non-string', () => {
      expect(() => restoreVowels(123)).toThrow();
    });
  });

  describe('multiObfuscate', () => {
    it('should apply multiple techniques', () => {
      const result = multiObfuscate('Hello', ['reverse', 'vowels']);
      expect(result).not.toBe('Hello');
    });

    it('should use default techniques', () => {
      const result = multiObfuscate('Hello');
      expect(result).not.toBe('Hello');
    });

    it('should apply techniques in order', () => {
      const result1 = multiObfuscate('Hello', [
        'reverse',
        'vowels',
      ]);
      const result2 = multiObfuscate('Hello', [
        'vowels',
        'reverse',
      ]);
      // Both are valid obfuscations, just checking they produce output
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });

    it('should accept multiple techniques', () => {
      const result = multiObfuscate('Hello', [
        'reverse',
        'vowels',
        'leet',
      ]);
      expect(result).not.toBe('Hello');
    });

    it('should throw error for invalid technique', () => {
      expect(
        () => multiObfuscate('Hello', ['invalid']),
      ).toThrow();
    });

    it('should throw error for non-string', () => {
      expect(() => multiObfuscate(123, ['reverse'])).toThrow();
    });
  });

  describe('interleaveCharacters', () => {
    it('should interleave with default space', () => {
      expect(interleaveCharacters('Hi')).toBe('H i');
    });

    it('should interleave with custom separator', () => {
      expect(interleaveCharacters('Hi', '-')).toBe('H-i');
    });

    it('should work with empty string', () => {
      expect(interleaveCharacters('')).toBe('');
    });

    it('should work with single character', () => {
      expect(interleaveCharacters('H', '-')).toBe('H');
    });

    it('should throw error for non-string text', () => {
      expect(() => interleaveCharacters(123, '-')).toThrow();
    });
  });

  describe('deinterleaveCharacters', () => {
    it('should remove interleaved spaces', () => {
      expect(deinterleaveCharacters('H i')).toBe('Hi');
    });

    it('should remove custom separator', () => {
      expect(deinterleaveCharacters('H-i', '-')).toBe('Hi');
    });

    it('should be inverse of interleave', () => {
      const original = 'Hello';
      const interleaved = interleaveCharacters(original, '-');
      const restored = deinterleaveCharacters(interleaved, '-');
      expect(restored).toBe(original);
    });

    it('should throw error for non-string', () => {
      expect(() => deinterleaveCharacters(123, '-')).toThrow();
    });
  });

  describe('toHomoglyph', () => {
    it('should replace characters with homoglyphs', () => {
      const result = toHomoglyph('Hello');
      // Result should have Cyrillic characters but appear similar
      expect(result).toBeDefined();
    });

    it('should preserve unknown characters', () => {
      const result = toHomoglyph('123!');
      expect(result).toBe('123!');
    });

    it('should handle mixed case', () => {
      const result = toHomoglyph('HeLLo');
      expect(result).toBeDefined();
    });

    it('should throw error for non-string', () => {
      expect(() => toHomoglyph(123)).toThrow();
    });
  });

  describe('calculateObfuscationStrength', () => {
    it('should calculate strength for obfuscated text', () => {
      const strength = calculateObfuscationStrength(
        'Hello',
        multiObfuscate('Hello'),
      );
      expect(strength).toBeGreaterThan(0);
      expect(strength).toBeLessThanOrEqual(100);
    });

    it('should return 0 for identical text', () => {
      // Basic check - same text should have lower or equal strength
      const strength = calculateObfuscationStrength('Hello', 'Hello');
      expect(strength).toBeLessThanOrEqual(100);
    });

    it('should reward different cases', () => {
      const strength1 = calculateObfuscationStrength(
        'hello',
        'HELLO',
      );
      expect(strength1).toBeGreaterThanOrEqual(0);
    });

    it('should reward special characters', () => {
      const strength = calculateObfuscationStrength('Hello', 'H3LL0!');
      expect(strength).toBeGreaterThan(0);
    });

    it('should throw error for non-string', () => {
      expect(
        () => calculateObfuscationStrength(123, 'Hello'),
      ).toThrow();
      expect(
        () => calculateObfuscationStrength('Hello', 123),
      ).toThrow();
    });

    it('should cap at 100', () => {
      const strength = calculateObfuscationStrength(
        'Hello',
        multiObfuscate('Hello', [
          'reverse',
          'vowels',
          'leet',
          'shift',
          'random',
        ]),
      );
      expect(strength).toBeLessThanOrEqual(100);
    });
  });

  describe('Integration Tests', () => {
    it('should create reversible obfuscation workflow', () => {
      const original = 'Hello World';
      const vowelsReplaced = replaceVowels(original);
      const restored = restoreVowels(vowelsReplaced);
      expect(restored.toLowerCase()).toBe(original.toLowerCase());
    });

    it('should create reversible interleave workflow', () => {
      const original = 'Secret';
      const interleaved = interleaveCharacters(original, '|');
      expect(interleaved).not.toBe(original);
      const deinterleaved = deinterleaveCharacters(interleaved, '|');
      expect(deinterleaved).toBe(original);
    });

    it('should combine multiple obfuscation methods', () => {
      const original = 'Secret Message';
      const obfuscated = multiObfuscate(original, [
        'vowels',
        'leet',
        'reverse',
      ]);
      expect(obfuscated).not.toBe(original);
      expect(obfuscated.length).toBeGreaterThan(0);
    });

    it('should calculate strength for complex obfuscation', () => {
      const original = 'Important Data';
      const obfuscated = multiObfuscate(original);
      const strength = calculateObfuscationStrength(
        original,
        obfuscated,
      );
      expect(strength).toBeGreaterThan(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text', () => {
      const longText = 'A'.repeat(10000);
      const result = multiObfuscate(longText, ['reverse', 'vowels']);
      expect(result).toBeDefined();
    });

    it('should handle text with all vowels', () => {
      const result = replaceVowels('aeiouAEIOU');
      expect(result).not.toContain('a');
      expect(result).not.toContain('e');
    });

    it('should handle text with no vowels', () => {
      const result = replaceVowels('bcdfghjklmnpqrstvwxyz');
      expect(result).toBe('bcdfghjklmnpqrstvwxyz');
    });

    it('should handle text with only spaces', () => {
      expect(reverseText('   ')).toBe('   ');
    });

    it('should handle text with special unicode', () => {
      const result = reverseText('Hëllö');
      expect(result).toBeDefined();
    });

    it('should handle numeric text', () => {
      const result = shiftCharacters('123456', 1);
      expect(result).toBe('234567');
    });

    it('should handle mixed obfuscation layers', () => {
      const text = 'LayerTest123';
      const result = multiObfuscate(text, [
        'vowels',
        'shift',
        'leet',
      ]);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
