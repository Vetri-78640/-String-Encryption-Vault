#!/usr/bin/env node

/**
 * CLI Main Entry Point for String-Encryption-Vault
 *
 * This module provides command-line interface for all encryption utilities.
 */

import { program } from 'commander';
import chalk from 'chalk';

import {
  encrypt as caesarEncrypt,
  decrypt as caesarDecrypt,
  bruteForce,
} from '../src/caesarCipher.js';

import { encode as rot13Encode, decode as rot13Decode } from '../src/rot13.js';

import { encode as base64Encode, decode as base64Decode } from '../src/base64Encoder.js';

const packageVersion = '1.0.0';

program
  .name('encryption-vault')
  .description('String-Encryption-Vault: Encryption/Decryption Utilities')
  .version(packageVersion);

// Caesar Cipher Command
program
  .command('caesar')
  .description('Caesar Cipher encryption/decryption')
  .option('-m, --mode <mode>', 'encrypt or decrypt', 'encrypt')
  .option('-t, --text <text>', 'Text to process')
  .option('-s, --shift <number>', 'Shift value (1-25)', '3')
  .action((options) => {
    try {
      const shift = parseInt(options.shift, 10);
      let result;

      if (options.mode === 'encrypt') {
        result = caesarEncrypt(options.text, shift);
        console.log(chalk.green(`✓ Encrypted: ${result}`));
      } else if (options.mode === 'decrypt') {
        result = caesarDecrypt(options.text, shift);
        console.log(chalk.green(`✓ Decrypted: ${result}`));
      } else {
        console.error(chalk.red('Invalid mode. Use "encrypt" or "decrypt"'));
      }
    } catch (error) {
      console.error(chalk.red(`✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

// ROT13 Command
program
  .command('rot13')
  .description('ROT13 encoder/decoder')
  .option('-t, --text <text>', 'Text to process')
  .action((options) => {
    try {
      const result = rot13Encode(options.text);
      console.log(chalk.green(`✓ Result: ${result}`));
    } catch (error) {
      console.error(chalk.red(`✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Base64 Command
program
  .command('base64')
  .description('Base64 encoding/decoding')
  .option('-m, --mode <mode>', 'encode or decode', 'encode')
  .option('-t, --text <text>', 'Text to process')
  .action((options) => {
    try {
      let result;

      if (options.mode === 'encode') {
        result = base64Encode(options.text);
        console.log(chalk.green(`✓ Encoded: ${result}`));
      } else if (options.mode === 'decode') {
        result = base64Decode(options.text);
        console.log(chalk.green(`✓ Decoded: ${result}`));
      } else {
        console.error(chalk.red('Invalid mode. Use "encode" or "decode"'));
      }
    } catch (error) {
      console.error(chalk.red(`✗ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Brute Force Command
program
  .command('brute-force')
  .description('Brute force Caesar Cipher')
  .option('-t, --text <text>', 'Ciphertext to crack')
  .action((options) => {
    try {
      const results = bruteForce(options.text);
      console.log(chalk.blue('Possible plaintexts:'));
      Object.entries(results).forEach(([shift, plaintext]) => {
        console.log(`  Shift ${String(shift).padStart(2)}: ${plaintext}`);
      });
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
