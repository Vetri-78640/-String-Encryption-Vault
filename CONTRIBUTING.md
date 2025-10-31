# Contributing to String-Encryption-Vault

Thank you for your interest in contributing to String-Encryption-Vault! We're excited to have you contribute during Hacktoberfest and beyond. This guide will help you get started.

## Getting Started

### 1. Fork the Repository
Click the "Fork" button on the GitHub repository to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR-USERNAME/String-Encryption-Vault.git
cd String-Encryption-Vault
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/Vetri-78640/String-Encryption-Vault.git
```

### 4. Install Dependencies
```bash
npm install
```

## Development Workflow

### Step 1: Update Main Branch
```bash
git checkout main
git pull upstream main
```

### Step 2: Create Feature Branch
Create a new branch for each feature. Follow this naming convention:

```bash
# For new ciphers
git checkout -b feature/cipher-name

# For new encoders
git checkout -b feature/encoder-name

# For utilities
git checkout -b feature/utility-name

# For bug fixes
git checkout -b bugfix/issue-description

# For documentation
git checkout -b docs/update-description
```

**Examples:**
```bash
git checkout -b feature/caesar-cipher
git checkout -b feature/morse-code
git checkout -b bugfix/fix-rot13-lowercase
```

### Step 3: Implement Your Feature

Follow the structure for each module:

```javascript
/**
 * [Module Name]
 *
 * Description of what this module does.
 *
 * Educational value:
 * - Why this is important to learn
 * - Historical context
 *
 * Security notes:
 * - Any security considerations
 * - Limitations
 */

/**
 * Encrypt plaintext
 * @param {string} plaintext - Text to encrypt
 * @param {number} [key] - Encryption key/parameter
 * @returns {string} Encrypted text
 * @throws {Error} If parameters are invalid
 * @example
 * encrypt("HELLO", key)  // "ENCRYPTED_TEXT"
 */
export function encrypt(plaintext, key) {
  if (typeof plaintext !== 'string') {
    throw new TypeError('Plaintext must be a string');
  }
  
  // Implementation
}

/**
 * Decrypt ciphertext
 * @param {string} ciphertext - Text to decrypt
 * @param {number} [key] - Decryption key/parameter
 * @returns {string} Decrypted text
 * @throws {Error} If parameters are invalid
 * @example
 * decrypt("ENCRYPTED_TEXT", key)  // "HELLO"
 */
export function decrypt(ciphertext, key) {
  if (typeof ciphertext !== 'string') {
    throw new TypeError('Ciphertext must be a string');
  }
  
  // Implementation
}
```

### Step 4: Write Unit Tests

Create tests in `tests/cipherName.test.js`:

```javascript
import { encrypt, decrypt } from '../src/cipherName.js';

describe('Your Cipher', () => {
  describe('encrypt', () => {
    it('should encrypt text', () => {
      expect(encrypt('HELLO', key)).toBe('expected');
    });

    it('should throw error for invalid input', () => {
      expect(() => encrypt(123, key)).toThrow(TypeError);
    });
  });

  describe('decrypt', () => {
    it('should decrypt text', () => {
      expect(decrypt('expected', key)).toBe('HELLO');
    });

    it('should be inverse of encrypt', () => {
      const original = 'HELLO WORLD';
      const encrypted = encrypt(original, key);
      expect(decrypt(encrypted, key)).toBe(original);
    });
  });
});
```

**Run Tests:**
```bash
# Test specific module
npm test -- caesarCipher.test.js

# Test all modules
npm test

# With coverage
npm run test:coverage
```

### Step 5: Add Documentation

Create or update documentation in `docs/`:

```markdown
# Your Cipher Name

## Overview
Brief description of what this cipher does.

## How It Works
Explain the algorithm:
- Step 1
- Step 2
- Step 3

## Security Notes
Important security considerations:
- Note 1
- Note 2

## Use Cases
Where and why to use this cipher.

## Examples
\`\`\`javascript
import { encrypt, decrypt } from '../src/yourModule.js';

const result = encrypt('HELLO', key);
console.log(result);
\`\`\`

## References
- Link to reference material
- Academic papers
- Related resources
```

### Step 6: Commit Changes

Write clear, meaningful commit messages:

```bash
git add .

# Use conventional commits
git commit -m "feat: implement caesar cipher with encrypt/decrypt functions"
git commit -m "test: add comprehensive tests for caesar cipher"
git commit -m "docs: add caesar cipher explanation to docs"
git commit -m "fix: handle edge cases in rot13 encoder"
```

**Commit Message Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `chore`: Maintenance tasks

### Step 7: Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### Step 8: Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template with:
   - Clear description of changes
   - Motivation and context
   - Type of change (bug fix, feature, etc.)
   - Screenshots/examples if applicable
   - Checklist confirmation

**PR Title Format:**
```
[FEATURE] Caesar Cipher Implementation
[BUGFIX] Fix ROT13 lowercase handling
[DOCS] Add Morse Code guide
```

## Code Quality Standards

### Style Guide
- Follow ESLint rules (airbnb-base)
- Use 2 spaces for indentation
- Max line length: 100 characters
- Use const/let, not var
- Use arrow functions when appropriate

### Code Formatting
```bash
# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# Check style with ESLint
npm run lint

# Fix style issues
npm run lint:fix
```

### Documentation Requirements
- All functions must have JSDoc comments
- Include @param, @returns, @throws tags
- Include @example in docstrings
- Describe what the function does in the summary

### Testing Requirements
- Minimum 80% code coverage
- Test happy path scenarios
- Test edge cases
- Test error handling
- Test with different input types

## Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows ESLint rules
- [ ] All tests pass: `npm test`
- [ ] New tests added for new functionality
- [ ] Code coverage maintained (80%+)
- [ ] JSDoc comments added to all functions
- [ ] Documentation updated in `docs/`
- [ ] Commit messages are clear
- [ ] PR description is detailed
- [ ] No merge conflicts with main branch
- [ ] Code is formatted with Prettier

## Common Issues & Solutions

### Issue: "npm: command not found"
Make sure Node.js is installed:
```bash
node --version
npm --version
```

### Issue: Tests failing locally
```bash
# Update dependencies
npm install

# Run tests with verbose output
npm test -- --verbose

# Check Node version
node --version
```

### Issue: Linting errors
```bash
# Fix auto-fixable errors
npm run lint:fix

# Format code
npm run format
```

## Feature Implementation Examples

### Example 1: Caesar Cipher
```bash
git checkout -b feature/caesar-cipher

# Create src/caesarCipher.js
# Create tests/caesarCipher.test.js
# Update docs/cipher_guide.md
# Update src/index.js (add export)

npm test
npm run lint:fix
npm run format

git add .
git commit -m "feat: implement caesar cipher with full test coverage"
git push origin feature/caesar-cipher
```

### Example 2: Password Hasher
```bash
git checkout -b feature/password-hasher

# Create src/passwordHasher.js
# Create tests/passwordHasher.test.js
# Update docs as needed
# Update src/index.js (add export)

npm test
npm run lint:fix

git add .
git commit -m "feat: add password hashing with bcrypt support"
git push origin feature/password-hasher
```

## Review Process

After you submit a PR:
1. Maintainers will review your code
2. They may request changes
3. Make requested changes in the same branch
4. Push updates (they'll be automatically added to the PR)
5. Once approved, your PR will be merged!

## Getting Help

- Check existing documentation
- Look through GitHub issues
- Open a discussion for questions
- Contact maintainers if stuck

## Recognition

Contributors are recognized in:
- README contributor section
- GitHub contributors page
- Release notes for each contribution

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. Be respectful, inclusive, and constructive in all interactions.

---

**Happy Contributing!** We look forward to your Hacktoberfest contributions!
