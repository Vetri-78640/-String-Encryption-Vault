import {
  textToBraille,
  brailleToText,
  charToBraille,
  brailleToChar,
  isValidBrailleText,
  isValidBraille,
  getBrailleStats,
  getTextStats,
  validateBraille,
  validateText,
  textToBrailleWords,
  brailleWordsToText,
  brailleToAscii,
  getBrailleDotPattern,
  getSupportedCharacters,
} from '../src/brailleConverter.js';

describe('Braille Converter', () => {
  describe('textToBraille', () => {
    it('should convert single letter', () => {
      const result = textToBraille('A');
      expect(result).toBe('⠁');
    });

    it('should convert multiple letters', () => {
      const result = textToBraille('HELLO');
      expect(result).toBe('⠓⠑⠇⠇⠕');
    });

    it('should convert with spaces', () => {
      const result = textToBraille('HELLO WORLD');
      expect(result).toBe('⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙');
    });

    it('should handle lowercase conversion to uppercase', () => {
      const result1 = textToBraille('hello');
      const result2 = textToBraille('HELLO');
      expect(result1).toBe(result2);
    });

    it('should convert numbers', () => {
      const result = textToBraille('123');
      expect(result).toContain('⠼');
    });

    it('should convert punctuation', () => {
      const result = textToBraille('.');
      expect(result).toBe('⠸');
    });

    it('should convert full sentence', () => {
      const result = textToBraille('HI');
      expect(result).toBe('⠓⠊');
    });

    it('should throw error for non-string', () => {
      expect(() => textToBraille(123)).toThrow(TypeError);
    });

    it('should handle all uppercase alphabet', () => {
      const result = textToBraille('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      expect(result).toHaveLength(26);
      expect(result).not.toContain('?');
    });

    it('should handle empty string', () => {
      const result = textToBraille('');
      expect(result).toBe('');
    });
  });

  describe('brailleToText', () => {
    it('should decode single character', () => {
      const result = brailleToText('⠁');
      expect(result).toBe('A');
    });

    it('should decode multiple characters', () => {
      const result = brailleToText('⠓⠑⠇⠇⠕');
      expect(result).toBe('HELLO');
    });

    it('should decode with spaces', () => {
      const result = brailleToText('⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙');
      expect(result).toBe('HELLO WORLD');
    });

    it('should be reversible with textToBraille', () => {
      const original = 'HELLO';
      const braille = textToBraille(original);
      const decoded = brailleToText(braille);
      expect(decoded).toBe(original);
    });

    it('should throw error for non-string', () => {
      expect(() => brailleToText(123)).toThrow(TypeError);
    });

    it('should handle empty string', () => {
      const result = brailleToText('');
      expect(result).toBe('');
    });
  });

  describe('charToBraille', () => {
    it('should convert A', () => {
      expect(charToBraille('A')).toBe('⠁');
    });

    it('should convert B', () => {
      expect(charToBraille('B')).toBe('⠃');
    });

    it('should convert lowercase to uppercase', () => {
      expect(charToBraille('a')).toBe('⠁');
    });

    it('should convert space', () => {
      expect(charToBraille(' ')).toBe('⠀');
    });

    it('should convert punctuation', () => {
      expect(charToBraille('.')).toBe('⠸');
    });

    it('should throw error for non-string', () => {
      expect(() => charToBraille(123)).toThrow(TypeError);
    });

    it('should throw error for multiple characters', () => {
      expect(() => charToBraille('AB')).toThrow();
    });
  });

  describe('brailleToChar', () => {
    it('should convert A braille', () => {
      expect(brailleToChar('⠁')).toBe('A');
    });

    it('should convert space braille', () => {
      expect(brailleToChar('⠀')).toBe(' ');
    });

    it('should throw error for non-string', () => {
      expect(() => brailleToChar(123)).toThrow(TypeError);
    });
  });

  describe('isValidBrailleText', () => {
    it('should validate text with supported characters', () => {
      expect(isValidBrailleText('HELLO')).toBe(true);
    });

    it('should validate mixed case', () => {
      expect(isValidBrailleText('HeLLo')).toBe(true);
    });

    it('should validate with spaces', () => {
      expect(isValidBrailleText('HELLO WORLD')).toBe(true);
    });

    it('should reject text with unsupported characters', () => {
      expect(isValidBrailleText('HELLO©')).toBe(false);
    });

    it('should reject non-ASCII characters that are not in dictionary', () => {
      expect(isValidBrailleText('HELLO€')).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => isValidBrailleText(123)).toThrow(TypeError);
    });

    it('should accept all supported letters', () => {
      expect(isValidBrailleText('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(true);
    });

    it('should accept all supported digits', () => {
      expect(isValidBrailleText('0123456789')).toBe(true);
    });
  });

  describe('isValidBraille', () => {
    it('should validate valid Braille', () => {
      const braille = textToBraille('HELLO');
      expect(isValidBraille(braille)).toBe(true);
    });

    it('should reject invalid Braille', () => {
      expect(isValidBraille('A')).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => isValidBraille(123)).toThrow(TypeError);
    });
  });

  describe('getBrailleStats', () => {
    it('should calculate stats for single word', () => {
      const braille = textToBraille('HELLO');
      const stats = getBrailleStats(braille);
      expect(stats.length).toBe(5);
      expect(stats.words).toBe(1);
      expect(stats.validChars).toBe(5);
      expect(stats.invalidChars).toBe(0);
    });

    it('should calculate stats for multiple words', () => {
      const braille = textToBraille('HELLO WORLD');
      const stats = getBrailleStats(braille);
      expect(stats.words).toBe(2);
    });

    it('should count invalid characters', () => {
      const stats = getBrailleStats('⠓⠑AAA⠕');
      expect(stats.invalidChars).toBeGreaterThan(0);
    });

    it('should throw error for non-string', () => {
      expect(() => getBrailleStats(123)).toThrow(TypeError);
    });
  });

  describe('getTextStats', () => {
    it('should calculate stats for single word', () => {
      const stats = getTextStats('HELLO');
      expect(stats.length).toBe(5);
      expect(stats.words).toBe(1);
      expect(stats.letters).toBe(5);
      expect(stats.numbers).toBe(0);
    });

    it('should count punctuation', () => {
      const stats = getTextStats('HELLO!');
      expect(stats.punctuation).toBe(1);
    });

    it('should count spaces', () => {
      const stats = getTextStats('HELLO WORLD');
      expect(stats.spaces).toBe(1);
    });

    it('should count numbers', () => {
      const stats = getTextStats('HELLO 123');
      expect(stats.numbers).toBe(3);
    });

    it('should throw error for non-string', () => {
      expect(() => getTextStats(123)).toThrow(TypeError);
    });
  });

  describe('validateBraille', () => {
    it('should validate correct Braille', () => {
      const braille = textToBraille('HELLO');
      const result = validateBraille(braille);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fix invalid Braille', () => {
      const result = validateBraille('⠓⠑HELLO⠕');
      expect(result.fixed).toContain('?');
      expect(result.isValid).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => validateBraille(123)).toThrow(TypeError);
    });
  });

  describe('validateText', () => {
    it('should validate correct text', () => {
      const result = validateText('HELLO');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fix invalid characters', () => {
      const result = validateText('HELLO©');
      expect(result.fixed).toContain('?');
      expect(result.isValid).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => validateText(123)).toThrow(TypeError);
    });
  });

  describe('textToBrailleWords', () => {
    it('should convert words with space separator', () => {
      const result = textToBrailleWords('HELLO WORLD');
      expect(result).toContain('⠀');
    });

    it('should handle single word', () => {
      const result = textToBrailleWords('HELLO');
      expect(result).toBe(textToBraille('HELLO'));
    });

    it('should be reversible with brailleWordsToText', () => {
      const original = 'HELLO WORLD';
      const braille = textToBrailleWords(original);
      const decoded = brailleWordsToText(braille);
      expect(decoded).toBe(original);
    });

    it('should throw error for non-string', () => {
      expect(() => textToBrailleWords(123)).toThrow(TypeError);
    });
  });

  describe('brailleWordsToText', () => {
    it('should decode words', () => {
      const result = brailleWordsToText('⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙');
      expect(result).toBe('HELLO WORLD');
    });

    it('should handle single word', () => {
      const result = brailleWordsToText('⠓⠑⠇⠇⠕');
      expect(result).toBe('HELLO');
    });

    it('should throw error for non-string', () => {
      expect(() => brailleWordsToText(123)).toThrow(TypeError);
    });
  });

  describe('brailleToAscii', () => {
    it('should create ASCII representation', () => {
      const result = brailleToAscii('⠁');
      expect(result).toContain('\n');
    });

    it('should show dot pattern', () => {
      const result = brailleToAscii('⠁');
      const lines = result.split('\n');
      expect(lines).toHaveLength(3);
    });

    it('should create ASCII representation for valid Braille', () => {
      const result = brailleToAscii('⠁');
      expect(result).toBeDefined();
      expect(result).toContain('\n');
    });

    it('should throw error for non-string', () => {
      expect(() => brailleToAscii(123)).toThrow(TypeError);
    });
  });

  describe('getBrailleDotPattern', () => {
    it('should get dots for A', () => {
      const dots = getBrailleDotPattern('⠁');
      expect(dots).toEqual([1]);
    });

    it('should get dots for B', () => {
      const dots = getBrailleDotPattern('⠃');
      expect(dots).toContain(1);
      expect(dots).toContain(2);
    });

    it('should return array of numbers', () => {
      const dots = getBrailleDotPattern('⠓');
      expect(Array.isArray(dots)).toBe(true);
      expect(dots.every((d) => typeof d === 'number')).toBe(true);
    });

    it('should throw error for non-string', () => {
      expect(() => getBrailleDotPattern(123)).toThrow(TypeError);
    });

    it('should throw error for multiple characters', () => {
      expect(() => getBrailleDotPattern('⠁⠃')).toThrow();
    });
  });

  describe('getSupportedCharacters', () => {
    it('should return object with three arrays', () => {
      const result = getSupportedCharacters();
      expect(result).toHaveProperty('letters');
      expect(result).toHaveProperty('numbers');
      expect(result).toHaveProperty('punctuation');
    });

    it('should have all 26 letters', () => {
      const result = getSupportedCharacters();
      expect(result.letters).toHaveLength(26);
    });

    it('should have all 10 digits', () => {
      const result = getSupportedCharacters();
      expect(result.numbers).toHaveLength(10);
    });

    it('should have multiple punctuation marks', () => {
      const result = getSupportedCharacters();
      expect(result.punctuation.length).toBeGreaterThan(10);
    });
  });

  describe('Integration Tests', () => {
    it('should round-trip text to Braille and back', () => {
      const original = 'HELLO WORLD';
      const braille = textToBraille(original);
      const decoded = brailleToText(braille);
      expect(decoded).toBe(original);
    });

    it('should handle sentence with punctuation', () => {
      const original = 'HELLO WORLD.';
      const braille = textToBraille(original);
      expect(braille).toBeDefined();
    });

    it('should handle numbers', () => {
      const original = 'TEST 123';
      const braille = textToBraille(original);
      expect(braille).toContain('⠼');
    });

    it('should validate stats match round-trip', () => {
      const original = 'HELLO WORLD';
      const braille = textToBraille(original);
      const stats = getBrailleStats(braille);
      expect(stats.validChars).toBe(braille.length);
    });

    it('should handle case insensitivity consistently', () => {
      const result1 = textToBraille('Hello');
      const result2 = textToBraille('HELLO');
      const result3 = textToBraille('hello');
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000);
      const result = textToBraille(longText);
      expect(result).toHaveLength(1000);
    });

    it('should handle only spaces', () => {
      const result = textToBraille('   ');
      expect(result).toBe('⠀⠀⠀');
    });

    it('should handle mixed case with punctuation', () => {
      const text = 'HeLLo, WoRLD!';
      const braille = textToBraille(text);
      expect(braille).toBeDefined();
    });

    it('should handle consecutive spaces', () => {
      const result = textToBraille('HELLO  WORLD');
      expect(result).toContain('⠀⠀');
    });

    it('should handle special punctuation', () => {
      const punctuation = ['.', ',', ';', ':', '!', '?'];
      punctuation.forEach((p) => {
        const result = textToBraille(p);
        expect(result).not.toContain('?');
      });
    });

    it('should gracefully handle unknown characters', () => {
      const result = textToBraille('HELLO©WORLD');
      expect(result).toContain('?');
    });

    it('should handle all alphabet combinations', () => {
      /* eslint-disable-next-line no-plusplus */
      for (let i = 65; i <= 90; i += 1) {
        const char = String.fromCharCode(i);
        const result = charToBraille(char);
        expect(result).not.toContain('?');
      }
    });

    it('should handle numbers separately', () => {
      const result = textToBraille('0123456789');
      expect(result).toContain('⠼');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should convert greeting', () => {
      const greeting = 'HELLO THERE';
      const braille = textToBraille(greeting);
      const decoded = brailleToText(braille);
      expect(decoded).toBe(greeting);
    });

    it('should handle address format', () => {
      const address = 'TEST STREET';
      const braille = textToBraille(address);
      expect(braille).toBeDefined();
    });

    it('should handle question', () => {
      const question = 'HOW ARE YOU';
      const braille = textToBraille(question);
      const decoded = brailleToText(braille);
      expect(decoded).toBe(question);
    });

    it('should handle date format', () => {
      const date = '2024 10 31';
      const braille = textToBraille(date);
      expect(braille).toContain('⠼');
    });

    it('should preserve information through conversion', () => {
      const original = 'BRAILLE TEST';
      const braille = textToBraille(original);
      const stats = getBrailleStats(braille);
      expect(stats.validChars).toBe(original.length);
    });
  });
});
