# Cipher & Encoder Guide

This guide provides detailed explanations of each cipher and encoder in String-Encryption-Vault.

## Table of Contents
1. [Caesar Cipher](#caesar-cipher)
2. [ROT13](#rot13)
3. [Base64](#base64)
4. [Vigenère Cipher](#vigenère-cipher)
5. [Text Obfuscator](#text-obfuscator)
6. [Morse Code](#morse-code)
7. [Braille Converter](#braille-converter)
8. [QR Code Decoder](#qr-code-decoder)
9. [Password Hasher](#password-hasher)

---

## Caesar Cipher

### Overview
The Caesar Cipher is one of the simplest and most famous encryption techniques. It works by shifting each letter in the plaintext a fixed number of places down or up the alphabet.

### How It Works

**Encryption Example:**
- Plaintext: `HELLO`
- Shift: 3
- Process: H→K, E→H, L→O, L→O, O→R
- Ciphertext: `KHOOR`

**Mathematical Representation:**
$$c = (p + k) \bmod 26$$

Where:
- $c$ = ciphertext letter
- $p$ = plaintext letter position (A=0, B=1, ..., Z=25)
- $k$ = shift key

### Security Notes

NOT SECURE FOR REAL USE
- Only 26 possible keys (brute-force in seconds)
- Frequency analysis can break it
- Used only for educational purposes

### Use Cases
- Learning encryption basics
- Encoding simple messages between friends
- Cryptography puzzles and games

### Implementation Notes
- Handle uppercase and lowercase
- Preserve non-alphabetic characters
- Validate shift value (1-25)

### Resources
- [Caesar Cipher on Wikipedia](https://en.wikipedia.org/wiki/Caesar_cipher)
- Originating from Julius Caesar (~100 BC)

---

## ROT13

### Overview
ROT13 is a special case of Caesar Cipher where the shift is always 13. It's used for simple obfuscation, not encryption, and is its own inverse (applying it twice returns the original).

### How It Works

**Encryption/Decryption:**
- Shift every letter by 13 positions
- Applying ROT13 twice gives original text

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ
NOPQRSTUVWXYZABCDEFGHIJKLM
```

**Example:**
- Plaintext: `HELLO WORLD`
- Ciphertext: `URYYB JBEYQ`
- Apply again: `HELLO WORLD` ✓

### Security Notes

NOT SECURE
- Only obfuscation, not encryption
- Trivial to break
- Any shift cipher can be broken in 26 tries

### Use Cases
- Simple text obfuscation
- Spoiler hiding in forums/comments
- Rot13 online challenges
- Learning cryptography basics

### Mathematical Properties
$$\text{ROT13}(\text{ROT13}(x)) = x$$

### Resources
- [ROT13 on Wikipedia](https://en.wikipedia.org/wiki/ROT13)
- Used in many online communities since the 1980s

---

## Base64

### Overview
Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII format. It's widely used for data transmission and storage.

### How It Works

**Encoding Process:**
1. Convert text to binary
2. Divide binary into 6-bit chunks
3. Convert each chunk to decimal (0-63)
4. Map to Base64 alphabet

**Base64 Alphabet:**
```
A-Z (0-25), a-z (26-51), 0-9 (52-61), + (62), / (63), = (padding)
```

**Example:**
- Plaintext: `HELLO`
- Binary: `01001000 01000101 01001100 01001100 01001111`
- Base64: `SEVMTk8=`

### Security Notes

NOT ENCRYPTION
- Encoding, not encryption
- Easily reversible
- Used for data format, not security

### Use Cases
- Email attachments
- Data URLs in web
- API data transmission
- Configuration files
- Image encoding in HTML/CSS

### Padding Rules
- Add `=` if result needs padding
- 1 byte → 2 chars + `==`
- 2 bytes → 3 chars + `=`
- 3 bytes → 4 chars (no padding)

### Resources
- [RFC 4648](https://tools.ietf.org/html/rfc4648)
- [Base64 on Wikipedia](https://en.wikipedia.org/wiki/Base64)

---

## Vigenère Cipher

### Overview
The Vigenère Cipher is a polyalphabetic substitution cipher that uses a keyword to generate multiple shift values. It's significantly more secure than Caesar Cipher.

### How It Works

**Encryption Process:**
1. Repeat the key to match message length
2. For each letter, shift by key letter's position
3. A=0, B=1, C=2, ... Z=25

**Example:**
```
Plaintext:  HELLO WORLD
Key:        KEYKEYKEYEK (repeated)
Shift by:   10,4,24,10,4
Ciphertext: RIJVS UYVJN
```

**Vigenère Square (Tabula Recta):**
```
    A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
A   A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
B   B C D E F G H I J K L M N O P Q R S T U V W X Y Z A
...
Z   Z A B C D E F G H I J K L M N O P Q R S T U V W X Y
```

### Mathematical Representation
$$c_i = (p_i + k_j) \bmod 26$$

Where:
- $c_i$ = ciphertext letter at position i
- $p_i$ = plaintext letter at position i
- $k_j$ = key letter position (repeated)

### Security Notes

WEAK BUT BETTER THAN CAESAR
- Resistant to simple frequency analysis
- Can be broken with Kasiski examination
- Use only for educational purposes
- Key length matters (longer = more secure)

### Use Cases
- Historical encryption study
- Educational demonstrations
- Puzzles and games
- Understanding polyalphabetic ciphers

### Cryptanalysis
- Kasiski examination to find key length
- Friedman test for key length estimation
- Frequency analysis on segments

### Resources
- [Vigenère Cipher on Wikipedia](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher)
- Used from 16th century until late 19th century
- Leon Battista Alberti (1568)

---

## Text Obfuscator

### Overview
Text Obfuscator scrambles text using advanced obfuscation techniques. It's NOT encryption but makes text harder to read at a glance.

### Techniques

**1. Character Shuffling**
- Randomize character order (except first/last letters)
- Humans can still read: "Tihs is eaidr!"

**2. Leetspeak**
- A → 4, E → 3, I → 1, O → 0, S → 5, T → 7, L → 1
- "HELLO" → "H3LL0"

**3. Reverse Engineering**
- Reverse substring order
- "HELLO WORLD" → "DLROW OLLEH"

**4. Substitution Pattern**
- Map characters to symbols
- "HELLO" → "$#11@"

### Security Notes

NOT ENCRYPTION
- Easily reversible
- Not secure
- For obfuscation only
- No cryptographic guarantees

### Use Cases
- Easter eggs in code
- Simple spoiler hiding
- Making text less obvious at glance
- Educational demonstrations

---

## Morse Code

### Overview
Morse code is a communication system using dots (·) and dashes (–) to represent letters, numbers, and punctuation. Originally used for telegraph.

### How It Works

**Morse Alphabet (Selected):**
```
A: .-      B: -...    C: -.-.    D: -..
E: .       F: ..-.    G: --.     H: ....
I: ..      J: .---    K: -.-     L: .-..
M: --      N: -.      O: ---     P: .--.
...
0: -----   1: .----   2: ..---   3: ...--
4: ....-   5: .....   6: -....   7: --...
8: ---..   9: ----.
```

**Timing:**
- Dot: 1 unit
- Dash: 3 units
- Space between symbols: 1 unit
- Space between letters: 3 units
- Space between words: 7 units

**Example:**
- "HELLO" → ".... . .-.. .-.. ---"

### Security Notes

ENCODING, NOT ENCRYPTION
- Not secure
- Historical communication method
- Requires synchronization

### Use Cases
- Historical communication
- Emergency signals (SOS: ··· --- ···)
- Ham radio communication
- Educational learning
- Accessibility tools

### SOS Signal
- SOS: "··· --- ···"
- Chosen because it's distinctive, NOT because it means "Save Our Souls"

### Resources
- [Morse Code on Wikipedia](https://en.wikipedia.org/wiki/Morse_code)
- Developed by Samuel Morse and Alfred Vail (1836-1838)
- Still used in aviation and marine radio

---

## Braille Converter

### Overview
Braille is a tactile writing system used by people who are blind or visually impaired. This converter translates text to Braille patterns.

### How It Works

**Braille Basics:**
- Uses 8-dot cells (3 rows × 2-4 columns)
- Different dot combinations = different characters
- Grade 1 (letters), Grade 2 (contractions), Grade 3 (shorthand)

**Cell Representation:**
```
⠐ = 1234 (all dots)
⠀ = empty (no dots)
⠠ = dot 6 (capitals)
```

**Example:**
- A: ⠁ (dot 1)
- B: ⠃ (dots 1, 2)
- C: ⠉ (dots 1, 4)

### Security Notes

ENCODING, NOT ENCRYPTION
- Accessibility tool, not security
- Reversible (Braille to text)
- Used for inclusive communication

### Use Cases
- Accessibility for visually impaired
- Educational tool
- Inclusive communication
- Learning Braille patterns

### Braille Standards
- American Braille
- UK Braille
- Unicode Braille Patterns (U+2800 to U+28FF)

### Resources
- [Braille on Wikipedia](https://en.wikipedia.org/wiki/Braille)
- Developed by Louis Braille (1825)
- International Braille standardization

---

## QR Code Decoder

### Overview
QR (Quick Response) codes are 2D barcodes that store information. This decoder reads and parses QR code content.

### How It Works

**QR Code Structure:**
1. **Finder patterns** - Three corners (L-shaped squares)
2. **Timing patterns** - Regular grid lines
3. **Data area** - Actual encoded data
4. **Format information** - Error correction level
5. **Version information** - Size indicator

**Data Capacity by Version:**
- Version 1 (21×21): ~25 numeric characters
- Version 5 (37×37): ~154 numeric characters
- Version 40 (177×177): ~7,089 numeric characters

**Error Correction Levels:**
- L: 7% damage recovery
- M: 15% damage recovery
- Q: 25% damage recovery
- H: 30% damage recovery

### Security Notes

VERIFICATION IMPORTANT
- QR codes can contain malicious URLs
- Always verify before scanning
- Don't assume QR = safe

### Use Cases
- URL shortening and sharing
- Product tracking
- WiFi credentials
- Ticket/boarding passes
- Business cards
- Event registration

### Supported Content
- URLs
- Text
- Phone numbers
- Email addresses
- WiFi credentials
- Contact information (vCard)
- Calendar events

### Resources
- [QR Code on Wikipedia](https://en.wikipedia.org/wiki/QR_code)
- Developed by Denso Wave (1994)
- ISO/IEC 18004 standard
- Open source libraries: zbar, pyzbar

---

## Password Hasher

### Overview
A password hasher creates a cryptographic hash of passwords for secure storage. Uses one-way functions so passwords cannot be recovered.

### How It Works

**Hashing Process:**
1. Take password as input
2. Apply cryptographic hash function
3. Generate fixed-length hash
4. Same password → always same hash
5. Different password → almost always different hash

**Example:**
```
Password: "MySecurePass123"
Hash: $2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ee7r6zc5zPMcJ8Ym
```

### Hashing Algorithms

**Insecure (DON'T USE):**
- MD5: Fast but cryptographically broken
- SHA1: Vulnerable to collisions
- Plain SHA256: Too fast for passwords

**Secure:**
- **bcrypt**: Slow, salted, adaptive (RECOMMENDED)
- **scrypt**: Memory-hard, very secure
- **Argon2**: Modern, memory-hard, GPU-resistant

### Security Notes

BEST PRACTICES:
- Always use salt
- Use bcrypt, scrypt, or Argon2
- Hash passwords, never encrypt them
- Use workfactor/cost >= 12
- Never log passwords
- Compare timing-safely

### Mathematical Properties
- **One-way**: Can't reverse (x → hash)
- **Deterministic**: Same input = same hash
- **Collision resistant**: Hard to find two inputs with same hash
- **Avalanche effect**: Small change = completely different hash

### Use Cases
- User authentication
- Password verification
- Secure credential storage
- Database security
- API key storage

### Implementation Example
```python
import bcrypt

# Hashing
password = b"MyPassword123"
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))

# Verification (does NOT decrypt, just compares hashes)
is_valid = bcrypt.checkpw(password, hashed)
```

### Common Mistakes

AVOID:
- Using MD5 or SHA1 for passwords
- Not using salt
- Not using cost/rounds parameter
- Storing plaintext passwords
- Using fast hash functions

### Resources
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [bcrypt Documentation](https://github.com/pyca/bcrypt)
- [Argon2 Documentation](https://github.com/hynek/argon2-cffi)

---

## Comparison Table

| Cipher | Type | Security | Use Case |
|--------|------|----------|----------|
| Caesar | Substitution | None | Learning |
| ROT13 | Substitution | None | Obfuscation |
| Base64 | Encoding | None | Data format |
| Vigenère | Substitution | Weak | Learning |
| Obfuscator | Scrambling | Very Weak | Fun |
| Morse | Encoding | None | Communication |
| Braille | Encoding | None | Accessibility |
| QR | Encoding | None | Storage |
| Password Hash | Hashing | Strong | Security |

---

## Learning Path

**Beginner:**
1. Caesar Cipher
2. ROT13
3. Base64

**Intermediate:**
4. Morse Code
5. Vigenère Cipher
6. Text Obfuscator

**Advanced:**
7. Password Hasher
8. QR Code Decoder
9. Braille Converter

---

**Happy Learning!**
