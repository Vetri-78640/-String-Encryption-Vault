/**
 * Usage Examples for String-Encryption-Vault
 *
 * This file demonstrates how to use each module in the vault.
 */

import {
  encrypt as caesarEncrypt,
  decrypt as caesarDecrypt,
  bruteForce,
  analyze as caesarAnalyze,
} from './src/caesarCipher.js';

import { encode as rot13Encode, decode as rot13Decode, analyze as rot13Analyze } from './src/rot13.js';

import {
  encode as base64Encode,
  decode as base64Decode,
  isBase64,
  analyze as base64Analyze,
} from './src/base64Encoder.js';

console.log('========================================');
console.log('String-Encryption-Vault Examples');
console.log('========================================\n');

// Example 1: Caesar Cipher
console.log('1️⃣  CAESAR CIPHER');
console.log('-----------------------------------');
const plaintext = 'HELLO WORLD';
const shift = 3;
const encrypted = caesarEncrypt(plaintext, shift);
const decrypted = caesarDecrypt(encrypted, shift);

console.log(`Plaintext:  ${plaintext}`);
console.log(`Shift:      ${shift}`);
console.log(`Encrypted:  ${encrypted}`);
console.log(`Decrypted:  ${decrypted}`);
console.log('');

// Brute force attack
console.log('Brute Force Attack:');
const ciphertext = 'KHOOR';
const results = bruteForce(ciphertext);
Object.entries(results).slice(0, 5).forEach(([shift, text]) => {
  console.log(`  Shift ${shift}: ${text}`);
});
console.log('');

// Analyze
console.log('Text Analysis:');
const analysis = caesarAnalyze('HELLO WORLD');
console.log(`  Total characters: ${analysis.totalChars}`);
console.log(`  Letters: ${analysis.letters}`);
console.log(`  Vowels: ${analysis.vowels}`);
console.log('');

// Example 2: ROT13
console.log('2️⃣  ROT13');
console.log('-----------------------------------');
const text = 'HELLO WORLD';
const encoded = rot13Encode(text);
const decoded = rot13Decode(encoded);

console.log(`Original: ${text}`);
console.log(`Encoded:  ${encoded}`);
console.log(`Decoded:  ${decoded}`);
console.log(`Self-inverse: ${rot13Encode(rot13Encode(text)) === text}`);
console.log('');

// Example 3: Base64
console.log('3️⃣  BASE64');
console.log('-----------------------------------');
const textToEncode = 'HELLO WORLD';
const base64Encoded = base64Encode(textToEncode);
const base64Decoded = base64Decode(base64Encoded);

console.log(`Original: ${textToEncode}`);
console.log(`Encoded:  ${base64Encoded}`);
console.log(`Decoded:  ${base64Decoded}`);
console.log(`Valid Base64: ${isBase64(base64Encoded)}`);
console.log('');

console.log('========================================');
console.log('Examples completed!');
console.log('========================================');
console.log('');
console.log('More features coming:');
console.log('  Vigenère Cipher');
console.log('  Password Hasher');
console.log('  Text Obfuscator');
console.log('  Morse Code');
console.log('  Braille Converter');
console.log('  QR Code Decoder');
console.log('');
console.log('Learn more: See docs/CONTRIBUTING.md for contribution guidelines');
