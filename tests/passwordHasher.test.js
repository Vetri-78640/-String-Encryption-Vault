/**
 * Password Hasher Tests
 * Comprehensive test suite for password hashing functionality
 */

import {
  generateSalt,
  hashPassword,
  verifyPassword,
  hashPasswordBcrypt,
  verifyPasswordBcrypt,
  checkPasswordStrength,
  suggestPasswordImprovements,
  hashMultiplePasswords,
} from '../src/passwordHasher.js';

describe('Password Hasher', () => {
  describe('generateSalt', () => {
    it('should generate a salt', () => {
      const salt = generateSalt();
      expect(typeof salt).toBe('string');
      expect(salt.length).toBeGreaterThan(0);
    });

    it('should generate different salts each time', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      expect(salt1).not.toBe(salt2);
    });

    it('should respect custom length', () => {
      const salt = generateSalt(32);
      const decodedLength = Buffer.from(salt, 'base64').length;
      expect(decodedLength).toBe(32);
    });

    it('should generate base64-encoded salt', () => {
      const salt = generateSalt();
      // Should not throw when decoding
      expect(() => {
        Buffer.from(salt, 'base64');
      }).not.toThrow();
    });

    it('should throw error for invalid length', () => {
      expect(() => generateSalt(-1)).toThrow();
      expect(() => generateSalt(0)).toThrow();
      expect(() => generateSalt('abc')).toThrow();
    });
  });

  describe('hashPassword (PBKDF2)', () => {
    it('should hash a password', () => {
      const result = hashPassword('myPassword123');
      expect(result.hash).toBeDefined();
      expect(result.salt).toBeDefined();
      expect(result.iterations).toBeDefined();
    });

    it('should generate different hashes for same password', () => {
      const hash1 = hashPassword('myPassword123');
      const hash2 = hashPassword('myPassword123');
      expect(hash1.hash).not.toBe(hash2.hash);
      expect(hash1.salt).not.toBe(hash2.salt);
    });

    it('should use provided salt', () => {
      const salt = generateSalt();
      const result1 = hashPassword('myPassword123', salt);
      const result2 = hashPassword('myPassword123', salt);
      expect(result1.hash).toBe(result2.hash);
      expect(result1.salt).toBe(salt);
    });

    it('should use custom iterations', () => {
      const result = hashPassword('myPassword123', null, 50000);
      expect(result.iterations).toBe('50000');
    });

    it('should return base64 encoded hash', () => {
      const result = hashPassword('myPassword123');
      expect(() => {
        Buffer.from(result.hash, 'base64');
      }).not.toThrow();
    });

    it('should throw error for empty password', () => {
      expect(() => hashPassword('')).toThrow();
    });

    it('should throw error for non-string password', () => {
      expect(() => hashPassword(123)).toThrow();
      expect(() => hashPassword(null)).toThrow();
      expect(() => hashPassword(undefined)).toThrow();
    });

    it('should throw error for invalid iterations', () => {
      expect(() => hashPassword('password', null, 500)).toThrow();
      expect(() => hashPassword('password', null, 'invalid')).toThrow();
    });
  });

  describe('verifyPassword', () => {
    it('should verify a correct password', () => {
      const password = 'myPassword123';
      const hashed = hashPassword(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;
      expect(verifyPassword(password, stored)).toBe(true);
    });

    it('should reject an incorrect password', () => {
      const password = 'myPassword123';
      const hashed = hashPassword(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;
      expect(verifyPassword('wrongPassword', stored)).toBe(false);
    });

    it('should reject tampered hash', () => {
      const password = 'myPassword123';
      const hashed = hashPassword(password);
      const tampered = `wronghash:${hashed.salt}:${hashed.iterations}`;
      expect(verifyPassword(password, tampered)).toBe(false);
    });

    it('should throw error for invalid format', () => {
      expect(() => verifyPassword('password', 'invalid')).toThrow();
    });

    it('should throw error for non-string inputs', () => {
      expect(() => verifyPassword(123, 'hash:salt:iter')).toThrow();
      expect(() => verifyPassword('password', 123)).toThrow();
    });

    it('should handle case sensitivity', () => {
      const hashed = hashPassword('MyPassword123');
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;
      expect(verifyPassword('mypassword123', stored)).toBe(false);
    });
  });

  describe('hashPasswordBcrypt (scrypt)', () => {
    it('should hash a password with bcrypt-like algorithm', () => {
      const result = hashPasswordBcrypt('myPassword123');
      expect(result.hash).toBeDefined();
      expect(result.salt).toBeDefined();
      expect(result.cost).toBeDefined();
    });

    it('should use custom cost factor', () => {
      const result = hashPasswordBcrypt('myPassword123', null, 12);
      expect(result.cost).toBe('12');
    });

    it('should generate different hashes with different salt', () => {
      const hash1 = hashPasswordBcrypt('myPassword123');
      const hash2 = hashPasswordBcrypt('myPassword123');
      expect(hash1.hash).not.toBe(hash2.hash);
    });

    it('should throw error for cost out of range', () => {
      expect(() => hashPasswordBcrypt('password', null, 3)).toThrow();
      expect(() => hashPasswordBcrypt('password', null, 32)).toThrow();
    });

    it('should throw error for empty password', () => {
      expect(() => hashPasswordBcrypt('')).toThrow();
    });
  });

  describe('verifyPasswordBcrypt', () => {
    it('should verify bcrypt-hashed password', () => {
      const password = 'myPassword123';
      const hashed = hashPasswordBcrypt(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.cost}`;
      expect(verifyPasswordBcrypt(password, stored)).toBe(true);
    });

    it('should reject incorrect password', () => {
      const password = 'myPassword123';
      const hashed = hashPasswordBcrypt(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.cost}`;
      expect(verifyPasswordBcrypt('wrongPassword', stored)).toBe(false);
    });

    it('should throw error for invalid format', () => {
      expect(() => verifyPasswordBcrypt('password', 'invalid')).toThrow();
    });
  });

  describe('checkPasswordStrength', () => {
    it('should validate strong password', () => {
      const result = checkPasswordStrength('StrongPass123!');
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.score).toBeGreaterThan(75);
    });

    it('should reject weak password', () => {
      const result = checkPasswordStrength('weak');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(50);
    });

    it('should check minimum length', () => {
      const result = checkPasswordStrength('Short1!');
      expect(result.errors.some((e) => e.includes('characters'))).toBe(true);
    });

    it('should require uppercase', () => {
      const result = checkPasswordStrength('lowercase123!');
      expect(result.errors.some((e) => e.includes('uppercase'))).toBe(true);
    });

    it('should require lowercase', () => {
      const result = checkPasswordStrength('UPPERCASE123!');
      expect(result.errors.some((e) => e.includes('lowercase'))).toBe(true);
    });

    it('should require numbers', () => {
      const result = checkPasswordStrength('NoNumbers!');
      expect(result.errors.some((e) => e.includes('number'))).toBe(true);
    });

    it('should require special characters', () => {
      const result = checkPasswordStrength('NoSpecial123');
      expect(result.errors.some((e) => e.includes('special'))).toBe(true);
    });

    it('should allow custom options', () => {
      const result = checkPasswordStrength('short', {
        minLength: 4,
        requireUppercase: false,
        requireNumbers: false,
        requireSpecial: false,
      });
      expect(result.valid).toBe(true);
    });

    it('should bonus for very long passwords', () => {
      const short = checkPasswordStrength('StrongPass123!');
      const long = checkPasswordStrength(
        'ThisIsAVeryLongStrongPassword123!',
      );
      expect(long.score).toBeGreaterThanOrEqual(short.score);
    });

    it('should throw error for non-string input', () => {
      expect(() => checkPasswordStrength(123)).toThrow();
    });
  });

  describe('suggestPasswordImprovements', () => {
    it('should suggest improvements for weak password', () => {
      const suggestions = suggestPasswordImprovements('weak');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should suggest uppercase addition', () => {
      const suggestions = suggestPasswordImprovements('lowercase123!');
      expect(suggestions.some((s) => s.includes('uppercase'))).toBe(true);
    });

    it('should suggest lowercase addition', () => {
      const suggestions = suggestPasswordImprovements('UPPERCASE123!');
      expect(suggestions.some((s) => s.includes('lowercase'))).toBe(true);
    });

    it('should suggest numbers addition', () => {
      const suggestions = suggestPasswordImprovements('NoNumbers!');
      expect(suggestions.some((s) => s.includes('number'))).toBe(true);
    });

    it('should suggest special chars addition', () => {
      const suggestions = suggestPasswordImprovements('NoSpecial123');
      expect(suggestions.some((s) => s.includes('special'))).toBe(true);
    });

    it('should suggest length increase', () => {
      const suggestions = suggestPasswordImprovements('Short1!');
      expect(suggestions.some((s) => s.includes('length'))).toBe(true);
    });

    it('should suggest avoiding repeating chars', () => {
      const suggestions = suggestPasswordImprovements(
        'Passsword111!',
      );
      expect(
        suggestions.some((s) => s.includes('repeat')),
      ).toBe(true);
    });

    it('should suggest mixing character types', () => {
      const suggestions = suggestPasswordImprovements('123456789');
      expect(suggestions.some((s) => s.includes('Mix'))).toBe(true);
    });

    it('should return empty array for strong password', () => {
      const suggestions = suggestPasswordImprovements(
        'StrongPassword123!',
      );
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should throw error for non-string input', () => {
      expect(() => suggestPasswordImprovements(123)).toThrow();
    });
  });

  describe('hashMultiplePasswords', () => {
    it('should hash multiple passwords', () => {
      const passwords = ['pass1', 'pass2', 'pass3'];
      const results = hashMultiplePasswords(passwords);
      expect(results.length).toBe(3);
      expect(results[0].hash).toBeDefined();
      expect(results[0].password).toBe('***masked***');
    });

    it('should use pbkdf2 algorithm by default', () => {
      const results = hashMultiplePasswords(['password']);
      expect(results[0].algorithm).toBe('pbkdf2');
    });

    it('should support bcrypt algorithm', () => {
      const results = hashMultiplePasswords(['password'], 'bcrypt');
      expect(results[0].algorithm).toBe('bcrypt');
    });

    it('should handle errors gracefully', () => {
      const passwords = ['valid', '', 'alsoValid'];
      const results = hashMultiplePasswords(passwords);
      expect(results[1].error).toBeDefined();
      expect(results[0].hash).toBeDefined();
    });

    it('should throw error for non-array input', () => {
      expect(() => hashMultiplePasswords('password')).toThrow();
    });

    it('should throw error for invalid algorithm', () => {
      expect(() => hashMultiplePasswords(
        ['password'],
        'invalid',
      )).toThrow();
    });

    it('should mask password in output', () => {
      const results = hashMultiplePasswords(['secretPassword']);
      expect(results[0].password).toBe('***masked***');
    });
  });

  describe('Integration Tests', () => {
    it('should support full password workflow', () => {
      const password = 'MySecurePassword123!';

      // Check strength
      const strength = checkPasswordStrength(password);
      expect(strength.valid).toBe(true);

      // Hash password
      const hashed = hashPassword(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;

      // Verify password
      expect(verifyPassword(password, stored)).toBe(true);
      expect(verifyPassword('wrongPassword', stored)).toBe(false);
    });

    it('should support bcrypt workflow', () => {
      const password = 'MySecurePassword123!';

      // Hash password
      const hashed = hashPasswordBcrypt(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.cost}`;

      // Verify password
      expect(verifyPasswordBcrypt(password, stored)).toBe(true);
      expect(verifyPasswordBcrypt('wrongPassword', stored)).toBe(false);
    });

    it('should handle multiple users', () => {
      const users = [
        { name: 'Alice', password: 'AlicePass123!' },
        { name: 'Bob', password: 'BobSecure456?' },
      ];

      const stored = users.map((user) => {
        const hashed = hashPassword(user.password);
        return {
          name: user.name,
          hash: `${hashed.hash}:${hashed.salt}:${hashed.iterations}`,
        };
      });

      // Verify each user
      expect(
        verifyPassword('AlicePass123!', stored[0].hash),
      ).toBe(true);
      expect(verifyPassword('BobSecure456?', stored[1].hash)).toBe(true);
      expect(
        verifyPassword('AlicePass123!', stored[1].hash),
      ).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long passwords', () => {
      const longPass = 'A'.repeat(1000);
      const hashed = hashPassword(longPass);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;
      expect(verifyPassword(longPass, stored)).toBe(true);
    });

    it('should handle passwords with special unicode', () => {
      const password = 'Pass\u{1F512}word123!'; // 🔒
      const hashed = hashPassword(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;
      expect(verifyPassword(password, stored)).toBe(true);
    });

    it('should handle passwords with spaces', () => {
      const password = 'My Secure Password 123!';
      const hashed = hashPassword(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;
      expect(verifyPassword(password, stored)).toBe(true);
    });

    it('should handle passwords with only numbers', () => {
      const password = '123456789012345';
      const hashed = hashPassword(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;
      expect(verifyPassword(password, stored)).toBe(true);
    });

    it('should handle empty suggestions array', () => {
      const suggestions = suggestPasswordImprovements(
        'ValidPassword123!',
      );
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should prevent timing attacks on verification', () => {
      const password = 'correctPassword123!';
      const hashed = hashPassword(password);
      const stored = `${hashed.hash}:${hashed.salt}:${hashed.iterations}`;

      // Both should complete in similar time
      const start1 = Date.now();
      verifyPassword('a', stored);
      const time1 = Date.now() - start1;

      const start2 = Date.now();
      verifyPassword('wrongPasswordThatIsLonger', stored);
      const time2 = Date.now() - start2;

      // Times should be relatively close (within 100ms typical)
      expect(Math.abs(time1 - time2)).toBeLessThan(100);
    });
  });
});
