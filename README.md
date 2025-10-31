# String-Encryption-Vault

> A comprehensive collection of encryption, decryption, and encoding utilities for educational and practical use.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-14%2B-brightgreen)
![Status](https://img.shields.io/badge/status-Active%20Development-yellow)

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Development Roadmap](#development-roadmap)
- [License](#license)

## Features

### Core Ciphers & Encoders
1. **Caesar Cipher** - Classic shift cipher implementation
2. **ROT13** - Special case rotation cipher
3. **Base64** - Binary-to-text encoding
4. **Vigenère Cipher** - Polyalphabetic substitution cipher
5. **Text Obfuscator** - Advanced text scrambling
6. **Morse Code** - Encoder and decoder
7. **Braille Converter** - Text to Braille conversion
8. **QR Code Decoder** - Parse and decode QR code content

### Additional Utilities
- **Simple Password Hasher** - Secure password hashing utilities
- **Comprehensive Testing** - Unit tests for each module (Jest)
- **CLI Tools** - Command-line interface for all features
- **Educational Documentation** - Learn cryptography fundamentals

## Project Structure

```
String-Encryption-Vault/
├── README.md
├── LICENSE
├── package.json
├── jest.config.js
├── .eslintrc.json
├── .prettierrc.json
│
├── src/
│   ├── index.js                 # Main export file
│   ├── caesarCipher.js          # Caesar cipher implementation
│   ├── rot13.js                 # ROT13 encoder/decoder
│   ├── base64Encoder.js         # Base64 encoding/decoding
│   ├── vigenereCipher.js        # Vigenère cipher (stub)
│   ├── passwordHasher.js        # Password hashing (stub)
│   ├── textObfuscator.js        # Text obfuscation (stub)
│   ├── morseCode.js             # Morse code converter (stub)
│   ├── brailleConverter.js      # Braille converter (stub)
│   └── qrDecoder.js             # QR code decoder (stub)
│
├── tests/
│   ├── caesarCipher.test.js
│   ├── rot13.test.js
│   ├── base64Encoder.test.js
│   ├── vigenereCipher.test.js
│   ├── passwordHasher.test.js
│   ├── textObfuscator.test.js
│   ├── morseCode.test.js
│   ├── brailleConverter.test.js
│   └── qrDecoder.test.js
│
├── cli/
│   └── main.js                  # CLI interface
│
├── docs/
│   ├── CONTRIBUTING.md
│   ├── DEVELOPMENT.md
│   └── cipher_guide.md
│
└── examples/
    └── usage_examples.js
```

## Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vetri-78640/String-Encryption-Vault.git
   cd String-Encryption-Vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Usage

### As a JavaScript Module

```javascript
import { encrypt, decrypt } from './src/caesarCipher.js';

// Encrypt
const ciphertext = encrypt("HELLO", 3);
console.log(ciphertext);  // Output: "KHOOR"

// Decrypt
const plaintext = decrypt("KHOOR", 3);
console.log(plaintext);   // Output: "HELLO"
```

### Using the CLI

```bash
# Caesar Cipher
npm run cli -- caesar --mode encrypt --text "HELLO" --shift 3

# ROT13
npm run cli -- rot13 --text "HELLO"

# Base64
npm run cli -- base64 --mode encode --text "HELLO"

# Brute Force Attack
npm run cli -- brute-force --text "KHOOR"
```

### Run Examples
```bash
npm run example
```

## Contributing

We welcome contributions for Hacktoberfest! Each feature should be developed in its own branch and submitted via a Pull Request.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** for each cipher/encoder:
   ```bash
   git checkout -b feature/caesar-cipher
   ```
3. **Implement the feature** following our guidelines
4. **Write unit tests** for your implementation:
   ```bash
   npm test
   ```
5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: implement caesar cipher with tests"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/caesar-cipher
   ```
7. **Create a Pull Request** with a clear description

### Contribution Guidelines

- One feature per branch/PR
- Include unit tests (minimum 80% coverage)
- Add JSDoc comments to all functions
- Follow ESLint and Prettier style guide
- Update relevant documentation
- Include usage examples

### Branch Naming Convention

```
feature/cipher-name          # For new ciphers
feature/encoder-name         # For encoders
feature/utility-name         # For utility functions
bugfix/issue-description     # For bug fixes
docs/update-description      # For documentation updates
```

## Development Roadmap

### Phase 1: Core Ciphers
- [x] **Caesar Cipher** - Classic shift cipher
- [x] **ROT13** - Rotation cipher variant
- [x] **Base64** - Binary encoding

### Phase 2: Advanced Ciphers
- [ ] **Vigenère Cipher** - Polyalphabetic cipher
- [ ] **Text Obfuscator** - Advanced obfuscation
- [ ] **Password Hasher** - Secure hashing

### Phase 3: Encoding & Conversion
- [ ] **Morse Code** - Morse encoder/decoder
- [ ] **Braille Converter** - Text to Braille
- [ ] **QR Code Decoder** - QR parsing

### Phase 4: Enhancement & Polish
- [ ] CLI tool optimization
- [ ] Performance improvements
- [ ] Extended documentation
- [ ] Web UI (optional)

## Educational Resources

Each cipher module includes:
- **Implementation details** - How the cipher works
- **Security notes** - Important security considerations
- **Historical context** - Background on the cipher
- **Examples** - Practical usage examples

See `docs/cipher_guide.md` for detailed explanations.

## Development Setup

For maintainers and developers:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Code style check
npm run lint

# Format code
npm run format
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Found a Bug?

Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment details

## Questions?

- Check existing documentation
- Look through GitHub issues
- Open a discussion for questions
- Contact maintainers if stuck

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all Hacktoberfest contributors
- Built by the cryptography enthusiast community
- Inspired by classic cipher implementations

---

**Happy Coding!** Let's make encryption education accessible to everyone!

## Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vetri-78640/String-Encryption-Vault.git
   cd String-Encryption-Vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Usage

### As a JavaScript Module

```javascript
import { encrypt, decrypt } from './src/caesarCipher.js';

// Encrypt
const ciphertext = encrypt("HELLO", 3);
console.log(ciphertext);  // Output: "KHOOR"

// Decrypt
const plaintext = decrypt("KHOOR", 3);
console.log(plaintext);   // Output: "HELLO"
```

### Using the CLI

```bash
# Caesar Cipher
npm run cli -- caesar --mode encrypt --text "HELLO" --shift 3

# ROT13
npm run cli -- rot13 --text "HELLO"

# Base64
npm run cli -- base64 --mode encode --text "HELLO"

# Brute Force Attack
npm run cli -- brute-force --text "KHOOR"
```

### Run Examples
```bash
npm run example
```

## Contributing

We welcome contributions for Hacktoberfest! Each feature should be developed in its own branch and submitted via a Pull Request.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** for each cipher/encoder:
   ```bash
   git checkout -b feature/caesar-cipher
   ```
3. **Implement the feature** following our guidelines
4. **Write unit tests** for your implementation:
   ```bash
   npm test
   ```
5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: implement caesar cipher with tests"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/caesar-cipher
   ```
7. **Create a Pull Request** with a clear description

### Contribution Guidelines

- One feature per branch/PR
- Include unit tests (minimum 80% coverage)
- Add JSDoc comments to all functions
- Follow ESLint and Prettier style guide
- Update relevant documentation
- Include usage examples

### Branch Naming Convention

```
feature/cipher-name          # For new ciphers
feature/encoder-name         # For encoders
feature/utility-name         # For utility functions
bugfix/issue-description     # For bug fixes
docs/update-description      # For documentation updates
```

## 🗓️ Development Roadmap

### Phase 1: Core Ciphers (Complete)
- [x] **Caesar Cipher** - Classic shift cipher
- [x] **ROT13** - Rotation cipher variant
- [x] **Base64** - Binary encoding

### Phase 2: Advanced Ciphers
- [ ] **Vigenère Cipher** - Polyalphabetic cipher
- [ ] **Text Obfuscator** - Advanced obfuscation
- [ ] **Password Hasher** - Secure hashing

### Phase 3: Encoding & Conversion
- [ ] **Morse Code** - Morse encoder/decoder
- [ ] **Braille Converter** - Text to Braille
- [ ] **QR Code Decoder** - QR parsing

### Phase 4: Enhancement & Polish
- [ ] CLI tool optimization
- [ ] Performance improvements
- [ ] Extended documentation
- [ ] Web UI (optional)

## Educational Resources

Each cipher module includes:
- **Implementation details** - How the cipher works
- **Security notes** - Important security considerations
- **Historical context** - Background on the cipher
- **Examples** - Practical usage examples

See `docs/cipher_guide.md` for detailed explanations.

## ⚙️ Development Setup

For maintainers and developers:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Code style check
npm run lint

# Format code
npm run format
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🐛 Found a Bug?

Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment details

## 💬 Questions?

- 📖 Check existing documentation
- 🐛 Look through GitHub issues
- 💬 Open a discussion for questions
- 📧 Contact maintainers if stuck

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all Hacktoberfest contributors
- Built by the cryptography enthusiast community
- Inspired by classic cipher implementations

---

**Happy Coding!** Let's make encryption education accessible to everyone!