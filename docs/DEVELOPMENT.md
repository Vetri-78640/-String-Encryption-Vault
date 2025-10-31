# Development Guide

This guide covers setting up your development environment and working with the codebase.

## Environment Setup

### System Requirements
- Node.js 14.0.0 or higher
- npm or yarn
- Git

### Initial Setup

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR-USERNAME/String-Encryption-Vault.git
cd String-Encryption-Vault
```

2. **Install dependencies:**
```bash
npm install
```

## Project Structure

```
src/
├── index.js                     # Main export file
├── caesarCipher.js              # Caesar cipher
├── rot13.js                     # ROT13 encoder
├── base64Encoder.js             # Base64 codec
├── vigenereCipher.js            # Vigenère cipher (stub)
├── passwordHasher.js            # Password hashing (stub)
├── textObfuscator.js            # Text obfuscation (stub)
├── morseCode.js                 # Morse encoder/decoder (stub)
├── brailleConverter.js          # Braille conversion (stub)
└── qrDecoder.js                 # QR code parsing (stub)

tests/
├── caesarCipher.test.js
├── rot13.test.js
├── base64Encoder.test.js
├── vigenereCipher.test.js       # (stub)
├── passwordHasher.test.js       # (stub)
├── textObfuscator.test.js       # (stub)
├── morseCode.test.js            # (stub)
├── brailleConverter.test.js     # (stub)
└── qrDecoder.test.js            # (stub)

cli/
└── main.js                      # CLI entry point

examples/
└── usage_examples.js
```

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/cipher-name
```

### 2. Implement the Feature
Write your code following ESLint and Prettier guidelines.

### 3. Run Tests
```bash
# Test specific module
npm test -- caesarCipher.test.js

# Test all
npm test

# With coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### 4. Code Quality Checks
```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### 5. Commit and Push
```bash
git add .
git commit -m "feat: implement caesar cipher"
git push origin feature/cipher-name
```

## Module Development Template

When creating a new cipher/encoder module, follow this template:

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
 * Custom error class
 */
class CustomError extends Error {
  constructor(message = 'Custom Error') {
    super(message);
    this.name = 'CustomError';
  }
}

/**
 * Validate input parameters
 * @private
 * @param {string} text - Text to validate
 * @throws {Error} If parameters are invalid
 */
function validateInput(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Text must be a string');
  }
}

/**
 * Encrypt plaintext using this cipher
 * @param {string} plaintext - Text to encrypt
 * @param {number} [key] - Encryption key/parameter
 * @returns {string} Encrypted text
 * @throws {Error} If parameters are invalid
 * @example
 * encrypt("HELLO", key);  // "ENCRYPTED_TEXT"
 */
export function encrypt(plaintext, key) {
  validateInput(plaintext);
  
  // Implementation
}

/**
 * Decrypt ciphertext using this cipher
 * @param {string} ciphertext - Text to decrypt
 * @param {number} [key] - Decryption key/parameter
 * @returns {string} Decrypted text
 * @throws {Error} If parameters are invalid
 * @example
 * decrypt("ENCRYPTED_TEXT", key);  // "HELLO"
 */
export function decrypt(ciphertext, key) {
  validateInput(ciphertext);
  
  // Implementation
}

/**
 * Analyze text (optional)
 * @param {string} text - Text to analyze
 * @returns {Object} Analysis results
 */
export function analyze(text) {
  validateInput(text);
  
  return {
    // Analysis data
  };
}
```

## Test Development Template

```javascript
import { encrypt, decrypt, CustomError } from '../src/yourModule.js';

describe('Your Module', () => {
  describe('encrypt', () => {
    it('should encrypt text', () => {
      expect(encrypt('HELLO', key)).toBe('expected');
    });

    it('should handle empty string', () => {
      expect(encrypt('', key)).toBe('');
    });

    it('should throw error for invalid type', () => {
      expect(() => encrypt(123, key)).toThrow(TypeError);
    });

    it('should throw error for invalid key', () => {
      expect(() => encrypt('HELLO', invalidKey)).toThrow(CustomError);
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

  describe('edge cases', () => {
    it('should handle special characters', () => {
      const text = 'Hello, World!';
      const encrypted = encrypt(text, key);
      expect(typeof encrypted).toBe('string');
    });

    it('should handle unicode', () => {
      const text = 'Hëllö Wørld';
      expect(encrypt(text, key)).toBeDefined();
    });

    it('should handle very long strings', () => {
      const longText = 'A'.repeat(10000);
      const encrypted = encrypt(longText, key);
      expect(encrypted.length).toBeGreaterThan(0);
    });
  });
});
```

## Running and Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test -- caesarCipher.test.js
```

### Run Specific Test
```bash
npm test -- caesarCipher.test.js -t "should encrypt"
```

### Coverage Report
```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` to view detailed report.

### Watch Mode
```bash
npm run test:watch
```

## Code Quality Tools

### Prettier (Code Formatter)
```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### ESLint (Linter)
```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Run Full Quality Check
```bash
npm run lint && npm run format:check && npm test
```

## Debugging

### Debug a Test
```bash
node --inspect-brk node_modules/.bin/jest tests/caesarCipher.test.js
```

Then open `chrome://inspect` in Chrome.

### Console Logging
```javascript
console.log('Debug info:', value);
```

### Verbose Test Output
```bash
npm test -- --verbose
```

## Examples and CLI

### Run Examples
```bash
npm run example
```

### Use CLI
```bash
npm run cli -- caesar --help
npm run cli -- caesar --mode encrypt --text "HELLO" --shift 3
```

## Performance Testing

```javascript
// Create a simple performance test
function benchmark(name, fn, iterations = 1000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const avgTime = (end - start) / iterations;
  console.log(`${name}: ${avgTime.toFixed(4)}ms per iteration`);
}

benchmark('Caesar Encrypt', () => {
  encrypt('HELLO WORLD', 3);
}, 10000);
```

## Common Commands

```bash
# Full development workflow
npm run lint:fix
npm run format
npm test
npm run test:coverage

# Quick quality check before commit
npm run lint && npm test

# Run example
npm run example

# Use CLI
npm run cli -- caesar --mode encrypt --text "TEST"
```

## Troubleshooting

### ModuleNotFoundError
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Not Running
```bash
# Check Jest configuration
npm test -- --showConfig

# Clear Jest cache
npm test -- --clearCache
```

### Lint Errors
```bash
# Auto-fix common issues
npm run lint:fix

# Format code
npm run format
```

### Coverage Not Generated
```bash
# Generate coverage report
npm run test:coverage

# View report
open coverage/lcov-report/index.html
```

## Git Workflow

### Keep Fork Updated
```bash
git fetch upstream
git rebase upstream/main
git push origin main
```

### Squash Commits Before PR
```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Force push (only if you're the only one working on this branch)
git push origin feature/branch-name --force
```

### Sync After Review Comments
```bash
# Make changes
git add .
git commit -m "fix: address review comments"
git push origin feature/branch-name
# Changes automatically appear in PR
```

---

For more information, see [CONTRIBUTING.md](CONTRIBUTING.md)

## Project Structure

```
src/
├── __init__.py
├── caesar_cipher.py          # Caesar cipher
├── rot13.py                   # ROT13 encoder
├── base64_encoder.py          # Base64 codec
├── vigenere_cipher.py         # Vigenère cipher
├── password_hasher.py         # Password hashing
├── text_obfuscator.py         # Text obfuscation
├── morse_code.py              # Morse encoder/decoder
├── braille_converter.py        # Braille conversion
└── qr_decoder.py              # QR code parsing

tests/
├── __init__.py
├── test_caesar_cipher.py
├── test_rot13.py
├── test_base64_encoder.py
├── test_vigenere_cipher.py
├── test_password_hasher.py
├── test_text_obfuscator.py
├── test_morse_code.py
├── test_braille_converter.py
└── test_qr_decoder.py

cli/
├── __init__.py
└── main.py                    # CLI entry point

docs/
├── CONTRIBUTING.md            # Contributing guidelines
├── DEVELOPMENT.md             # This file
└── cipher_guide.md            # Cipher explanations
```

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/cipher-name
```

### 2. Implement the Feature
Write your code following PEP 8 guidelines.

### 3. Run Tests
```bash
# Test specific module
pytest tests/test_your_module.py -v

# Test all
pytest tests/ -v

# With coverage report
pytest tests/ --cov=src --cov-report=term-missing
```

### 4. Code Quality Checks
```bash
# Format code
black src/ tests/
isort src/ tests/

# Check style
flake8 src/ tests/ --max-line-length=100

# Lint
pylint src/
```

### 5. Commit and Push
```bash
git add .
git commit -m "feat: implement caesar cipher"
git push origin feature/cipher-name
```

## Module Development Template

When creating a new cipher/encoder module, follow this template:

```python
"""
[Module Name]

Description of what this module does.

Educational value:
- Why this is important to learn
- Historical context

Security notes:
- Any security considerations
- Limitations
"""

from typing import Tuple, Dict, Any


class InvalidParameterError(Exception):
    """Raised when invalid parameters are provided."""
    pass


def validate_input(text: str, **kwargs) -> bool:
    """
    Validate input parameters.
    
    Args:
        text: Text to validate
        **kwargs: Additional parameters to validate
    
    Returns:
        bool: True if valid
    
    Raises:
        InvalidParameterError: If parameters are invalid
    """
    if not isinstance(text, str):
        raise InvalidParameterError("Text must be a string")
    
    # Add more validation as needed
    return True


def encrypt(plaintext: str, **kwargs) -> str:
    """
    Encrypt plaintext using this cipher.
    
    Args:
        plaintext: Text to encrypt
        **kwargs: Additional parameters
    
    Returns:
        str: Encrypted text
    
    Raises:
        InvalidParameterError: If parameters are invalid
    
    Example:
        >>> encrypt("HELLO", key="ABC")
        "ENCRYPTED_TEXT"
    """
    validate_input(plaintext, **kwargs)
    
    # Implementation
    pass


def decrypt(ciphertext: str, **kwargs) -> str:
    """
    Decrypt ciphertext using this cipher.
    
    Args:
        ciphertext: Text to decrypt
        **kwargs: Additional parameters
    
    Returns:
        str: Decrypted text
    
    Raises:
        InvalidParameterError: If parameters are invalid
    
    Example:
        >>> decrypt("ENCRYPTED_TEXT", key="ABC")
        "HELLO"
    """
    validate_input(ciphertext, **kwargs)
    
    # Implementation
    pass


def analyze(text: str) -> Dict[str, Any]:
    """
    Analyze text (optional).
    
    Args:
        text: Text to analyze
    
    Returns:
        dict: Analysis results
    """
    pass
```

## Test Development Template

```python
"""
Test suite for [Module Name]
"""

import pytest
from src.your_module import encrypt, decrypt, InvalidParameterError


class TestYourModule:
    """Test suite for Your Module"""
    
    def test_encrypt_basic(self):
        """Test basic encryption"""
        result = encrypt("HELLO", key="ABC")
        assert result == "expected"
    
    def test_decrypt_basic(self):
        """Test basic decryption"""
        result = decrypt("expected", key="ABC")
        assert result == "HELLO"
    
    def test_roundtrip(self):
        """Test encrypt then decrypt"""
        original = "HELLO WORLD"
        encrypted = encrypt(original, key="ABC")
        decrypted = decrypt(encrypted, key="ABC")
        assert decrypted == original
    
    def test_empty_string(self):
        """Test with empty string"""
        result = encrypt("", key="ABC")
        assert result == ""
    
    def test_special_characters(self):
        """Test with special characters"""
        text = "Hello, World! 123"
        result = encrypt(text, key="ABC")
        assert isinstance(result, str)
    
    def test_case_sensitivity(self):
        """Test case handling"""
        upper = encrypt("HELLO", key="ABC")
        lower = encrypt("hello", key="abc")
        # Test expectations based on cipher
    
    def test_invalid_key(self):
        """Test with invalid key"""
        with pytest.raises(InvalidParameterError):
            encrypt("HELLO", key="")
    
    def test_invalid_type(self):
        """Test with invalid type"""
        with pytest.raises(InvalidParameterError):
            encrypt(12345, key="ABC")
    
    def test_unicode(self):
        """Test with unicode characters"""
        text = "Hëllö Wørld"
        # Test based on cipher behavior


class TestEdgeCases:
    """Test edge cases"""
    
    def test_very_long_string(self):
        """Test with very long string"""
        long_text = "A" * 10000
        result = encrypt(long_text, key="ABC")
        assert len(result) == 10000
    
    def test_repeated_encryption(self):
        """Test encrypting multiple times"""
        text = "HELLO"
        result = text
        for _ in range(10):
            result = encrypt(result, key="ABC")
        # Test expectations


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
```

## Running and Testing

### Run All Tests
```bash
pytest tests/ -v
```

### Run Specific Test File
```bash
pytest tests/test_caesar_cipher.py -v
```

### Run Specific Test
```bash
pytest tests/test_caesar_cipher.py::TestCaesarCipher::test_encrypt_basic -v
```

### Coverage Report
```bash
pytest tests/ --cov=src --cov-report=html --cov-report=term-missing
```

### Watch Mode (Auto-run on changes)
```bash
# Using pytest-watch (install: pip install pytest-watch)
ptw tests/ -- -v
```

## Code Quality Tools

### Black (Code Formatter)
```bash
# Format all Python files
black src/ tests/ cli/

# Check formatting without changes
black --check src/ tests/ cli/
```

### isort (Import Sorter)
```bash
# Sort imports
isort src/ tests/ cli/

# Check imports
isort --check-only src/ tests/ cli/
```

### Flake8 (Linter)
```bash
# Check code style
flake8 src/ tests/ --max-line-length=100

# Generate report
flake8 src/ tests/ --format=html --htmldir=flake8_report
```

### Pylint (Code Analysis)
```bash
# Analyze code
pylint src/

# Generate report
pylint src/ --output-format=json > pylint_report.json
```

## Debugging

### Using Python Debugger
```python
import pdb

def my_function():
    x = 5
    pdb.set_trace()  # Debugger will stop here
    return x * 2
```

### Using pytest with Debugger
```bash
pytest tests/test_module.py -v --pdb
```

### Verbose Output
```bash
pytest tests/ -v -s  # -s shows print statements
```

## Documentation

### Building Docs (if Sphinx is set up)
```bash
cd docs
make html
```

### View Documentation
```bash
open docs/_build/html/index.html  # macOS
```

## Performance Testing

```python
import timeit

def benchmark():
    setup = "from src.cipher import encrypt"
    result = timeit.timeit(
        'encrypt("HELLO", key="ABC")',
        setup=setup,
        number=10000
    )
    print(f"Average time: {result / 10000} seconds")

if __name__ == "__main__":
    benchmark()
```

## Common Commands

```bash
# Full development workflow
black src/ tests/
isort src/ tests/
flake8 src/ tests/ --max-line-length=100
pytest tests/ -v --cov=src

# Quick check before committing
pytest tests/ -v && black --check src/ && flake8 src/
```

## Troubleshooting

### ModuleNotFoundError
```bash
# Make sure you're in the project root and virtual env is activated
which python  # Check you're using venv python
pip install -e .
```

### Tests Not Found
```bash
# Make sure __init__.py exists in test directories
# And pytest.ini or pyproject.toml is configured

pytest --collect-only  # List all collected tests
```

### Coverage Not Generated
```bash
# Install coverage
pip install coverage pytest-cov

# Run with coverage
pytest tests/ --cov=src --cov-report=html
```

---

For more information, see [CONTRIBUTING.md](CONTRIBUTING.md)
