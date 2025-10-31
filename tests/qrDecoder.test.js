import {
  isValidQRData,
  detectQRVersion,
  getErrorCorrectionLevel,
  calculateQRCapacity,
  analyzeQRContent,
  estimateQRVersion,
  decodeQRImage,
  extractURL,
  extractEmail,
  extractPhone,
  extractWiFi,
  extractContact,
  getQRStats,
  detectContentType,
  getQRFeatures,
} from '../src/qrDecoder.js';

describe('QR Code Decoder', () => {
  describe('isValidQRData', () => {
    it('should validate base64 data', () => {
      expect(isValidQRData('iVBORw0KGgoAAAANSUhEUg')).toBe(true);
    });

    it('should validate hex data', () => {
      expect(isValidQRData('89504E470D0A1A0A')).toBe(true);
    });

    it('should reject invalid data', () => {
      expect(isValidQRData('!@#$%^&*()')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidQRData('')).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => isValidQRData(123)).toThrow(TypeError);
    });

    it('should accept base64 with padding', () => {
      expect(isValidQRData('SGVsbG8gV29ybGQ=')).toBe(true);
    });
  });

  describe('detectQRVersion', () => {
    it('should detect version 1 (21x21)', () => {
      const result = detectQRVersion(21);
      expect(result.version).toBe(1);
      expect(result.modules).toBe(21);
    });

    it('should detect version 10 (57x57)', () => {
      const result = detectQRVersion(57);
      expect(result.version).toBe(10);
      expect(result.modules).toBe(57);
    });

    it('should throw error for invalid dimension', () => {
      expect(() => detectQRVersion(30)).toThrow();
    });

    it('should throw error for negative dimension', () => {
      expect(() => detectQRVersion(-21)).toThrow(TypeError);
    });

    it('should throw error for non-number', () => {
      expect(() => detectQRVersion('21')).toThrow(TypeError);
    });

    it('should return capacity', () => {
      const result = detectQRVersion(21);
      expect(result.capacity).toBeGreaterThan(0);
    });
  });

  describe('getErrorCorrectionLevel', () => {
    it('should get level L', () => {
      const result = getErrorCorrectionLevel('L');
      expect(result.level).toBe('L');
      expect(result.percentage).toBe(7);
    });

    it('should get level M', () => {
      const result = getErrorCorrectionLevel('M');
      expect(result.level).toBe('M');
      expect(result.percentage).toBe(15);
    });

    it('should get level Q', () => {
      const result = getErrorCorrectionLevel('Q');
      expect(result.level).toBe('Q');
      expect(result.percentage).toBe(25);
    });

    it('should get level H', () => {
      const result = getErrorCorrectionLevel('H');
      expect(result.level).toBe('H');
      expect(result.percentage).toBe(30);
    });

    it('should handle lowercase', () => {
      const result = getErrorCorrectionLevel('m');
      expect(result.level).toBe('M');
    });

    it('should throw error for invalid level', () => {
      expect(() => getErrorCorrectionLevel('X')).toThrow();
    });

    it('should throw error for non-string', () => {
      expect(() => getErrorCorrectionLevel(123)).toThrow(TypeError);
    });
  });

  describe('calculateQRCapacity', () => {
    it('should calculate capacity for version 1 level M', () => {
      const result = calculateQRCapacity(1, 'M');
      expect(result.version).toBe(1);
      expect(result.level).toBe('M');
      expect(result.numeric).toBeGreaterThan(0);
    });

    it('should have different capacities for different levels', () => {
      const l = calculateQRCapacity(1, 'L');
      const h = calculateQRCapacity(1, 'H');
      expect(l.byte).toBeGreaterThan(h.byte);
    });

    it('should increase capacity with version', () => {
      const v1 = calculateQRCapacity(1, 'M');
      const v10 = calculateQRCapacity(10, 'M');
      expect(v10.byte).toBeGreaterThan(v1.byte);
    });

    it('should throw error for invalid version', () => {
      expect(() => calculateQRCapacity(11, 'M')).toThrow();
    });

    it('should throw error for version 0', () => {
      expect(() => calculateQRCapacity(0, 'M')).toThrow();
    });
  });

  describe('analyzeQRContent', () => {
    it('should detect numeric content', () => {
      const result = analyzeQRContent('12345');
      expect(result.mode).toBe('numeric');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should detect alphanumeric content', () => {
      const result = analyzeQRContent('HELLO WORLD');
      expect(result.mode).toBe('alphanumeric');
    });

    it('should detect byte content', () => {
      const result = analyzeQRContent('hello world');
      expect(result.mode).toBe('byte');
    });

    it('should calculate estimated data bits', () => {
      const result = analyzeQRContent('TEST');
      expect(result.estimatedDataBits).toBeGreaterThan(0);
    });

    it('should return confidence', () => {
      const result = analyzeQRContent('12345');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should throw error for non-string', () => {
      expect(() => analyzeQRContent(123)).toThrow(TypeError);
    });
  });

  describe('estimateQRVersion', () => {
    it('should estimate version for short text', () => {
      const result = estimateQRVersion('Hi');
      expect(result.version).toBe(1);
      expect(result.fits).toBe(true);
    });

    it('should estimate version for medium text', () => {
      const result = estimateQRVersion('Hello World');
      expect(result.version).toBeGreaterThanOrEqual(1);
      expect(result.fits).toBe(true);
    });

    it('should return efficiency percentage', () => {
      const result = estimateQRVersion('Test');
      expect(result.efficiency).toBeDefined();
      expect(parseFloat(result.efficiency)).toBeGreaterThan(0);
    });

    it('should handle different error correction levels', () => {
      const resultL = estimateQRVersion('Test', 'L');
      const resultH = estimateQRVersion('Test', 'H');
      expect(resultH.version).toBeGreaterThanOrEqual(resultL.version);
    });

    it('should throw error for non-string', () => {
      expect(() => estimateQRVersion(123)).toThrow(TypeError);
    });

    it('should throw error if content exceeds capacity', () => {
      expect(() => estimateQRVersion('A'.repeat(10000))).toThrow();
    });
  });

  describe('decodeQRImage', () => {
    it('should decode base64 image', () => {
      const result = decodeQRImage('iVBORw0KGgoAAAA');
      expect(result.version).toBeGreaterThanOrEqual(1);
      expect(result.isValid).toBe(true);
    });

    it('should return version info', () => {
      const result = decodeQRImage('89504E470D0A1A0A');
      expect(result.version).toBeDefined();
      expect(result.modules).toBeDefined();
    });

    it('should return error correction level', () => {
      const result = decodeQRImage('SGVsbG8gV29ybGQ=');
      expect(result.ecLevel).toBe('M');
    });

    it('should throw error for invalid data', () => {
      expect(() => decodeQRImage('!@#$%^')).toThrow();
    });

    it('should throw error for non-string', () => {
      expect(() => decodeQRImage(123)).toThrow(TypeError);
    });

    it('should detect format info', () => {
      const result = decodeQRImage('iVBORw0KGgoAAAA');
      expect(result.hasFormat).toBe(true);
    });
  });

  describe('extractURL', () => {
    it('should extract HTTPS URL', () => {
      const result = extractURL('https://github.com/example');
      expect(result.found).toBe(true);
      expect(result.type).toBe('https');
    });

    it('should extract HTTP URL', () => {
      const result = extractURL('http://example.com');
      expect(result.found).toBe(true);
      expect(result.type).toBe('http');
    });

    it('should extract domain', () => {
      const result = extractURL('https://github.com/path');
      expect(result.domain).toBe('github.com');
    });

    it('should return not found for non-URL', () => {
      const result = extractURL('just text');
      expect(result.found).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => extractURL(123)).toThrow(TypeError);
    });

    it('should return URL length', () => {
      const result = extractURL('https://example.com');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('extractEmail', () => {
    it('should extract email address', () => {
      const result = extractEmail('test@example.com');
      expect(result.found).toBe(true);
      expect(result.email).toBe('test@example.com');
    });

    it('should extract local part', () => {
      const result = extractEmail('user@domain.com');
      expect(result.localPart).toBe('user');
    });

    it('should extract domain', () => {
      const result = extractEmail('user@domain.com');
      expect(result.domain).toBe('domain.com');
    });

    it('should detect mailto', () => {
      const result = extractEmail('mailto:test@example.com');
      expect(result.type).toBe('mailto');
    });

    it('should return not found for non-email', () => {
      const result = extractEmail('just text');
      expect(result.found).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => extractEmail(123)).toThrow(TypeError);
    });
  });

  describe('extractPhone', () => {
    it('should extract phone number', () => {
      const result = extractPhone('+1-555-123-4567');
      expect(result.found).toBe(true);
      expect(result.phone).toBeDefined();
    });

    it('should detect country code', () => {
      const result = extractPhone('+1-555-1234');
      expect(result.hasCountryCode).toBe(true);
    });

    it('should extract digits only', () => {
      const result = extractPhone('+1-555-123-4567');
      expect(result.digitsOnly).toBe('15551234567');
    });

    it('should detect tel prefix', () => {
      const result = extractPhone('tel:555-1234');
      expect(result.type).toBe('tel');
    });

    it('should return not found for invalid', () => {
      const result = extractPhone('ABC');
      expect(result.found).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => extractPhone(123)).toThrow(TypeError);
    });
  });

  describe('extractWiFi', () => {
    it('should extract WiFi credentials', () => {
      const result = extractWiFi('WIFI:T:WPA;S:MyNetwork;P:Password123;;');
      expect(result.found).toBe(true);
      expect(result.ssid).toBe('MyNetwork');
    });

    it('should extract password', () => {
      const result = extractWiFi('WIFI:T:WPA;S:Network;P:Pass123;;');
      expect(result.password).toBe('Pass123');
    });

    it('should extract security type', () => {
      const result = extractWiFi('WIFI:T:WPA;S:Network;P:Pass;;');
      expect(result.security).toBe('WPA');
    });

    it('should default to OPEN if not specified', () => {
      const result = extractWiFi('WIFI:S:Network;P:Pass;;');
      expect(result.security).toBe('OPEN');
    });

    it('should return not found for non-WiFi', () => {
      const result = extractWiFi('just text');
      expect(result.found).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => extractWiFi(123)).toThrow(TypeError);
    });
  });

  describe('extractContact', () => {
    it('should extract vCard contact', () => {
      const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEND:VCARD';
      const result = extractContact(vcard);
      expect(result.found).toBe(true);
      expect(result.name).toBe('John Doe');
    });

    it('should extract phone from vCard', () => {
      const vcard = 'BEGIN:VCARD\nFN:John\nTEL:555-1234\nEND:VCARD';
      const result = extractContact(vcard);
      expect(result.phone).toBe('555-1234');
    });

    it('should extract email from vCard', () => {
      const vcard = 'BEGIN:VCARD\nFN:John\nEMAIL:john@example.com\nEND:VCARD';
      const result = extractContact(vcard);
      expect(result.email).toBe('john@example.com');
    });

    it('should extract organization', () => {
      const vcard = 'BEGIN:VCARD\nFN:John\nORG:TechCorp\nEND:VCARD';
      const result = extractContact(vcard);
      expect(result.organization).toBe('TechCorp');
    });

    it('should return not found for non-vCard', () => {
      const result = extractContact('just text');
      expect(result.found).toBe(false);
    });

    it('should throw error for non-string', () => {
      expect(() => extractContact(123)).toThrow(TypeError);
    });
  });

  describe('getQRStats', () => {
    it('should calculate data length', () => {
      const stats = getQRStats('SGVsbG8gV29ybGQ=');
      expect(stats.length).toBe('SGVsbG8gV29ybGQ='.length);
    });

    it('should detect base64 format', () => {
      const stats = getQRStats('SGVsbG8gV29ybGQ=');
      expect(stats.isBase64).toBe(true);
    });

    it('should detect hex format', () => {
      const stats = getQRStats('48656C6C6F');
      expect(stats.isHex).toBe(true);
    });

    it('should detect base64 padding', () => {
      const stats = getQRStats('SGVsbG8=');
      expect(stats.hasBase64Padding).toBe(true);
    });

    it('should estimate bytes', () => {
      const stats = getQRStats('SGVsbG8gV29ybGQ=');
      expect(stats.estimatedBytes).toBeGreaterThan(0);
    });

    it('should estimate KB', () => {
      const stats = getQRStats('SGVsbG8gV29ybGQ=');
      expect(stats.estimatedKB).toBeDefined();
    });

    it('should throw error for non-string', () => {
      expect(() => getQRStats(123)).toThrow(TypeError);
    });
  });

  describe('detectContentType', () => {
    it('should detect URL', () => {
      const result = detectContentType('https://example.com');
      expect(result.primaryType).toBe('url');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should detect email', () => {
      const result = detectContentType('test@example.com');
      expect(result.primaryType).toBe('email');
    });

    it('should detect phone', () => {
      const result = detectContentType('+1-555-1234567');
      expect(result.primaryType).toBe('phone');
    });

    it('should detect WiFi', () => {
      const result = detectContentType('WIFI:T:WPA;S:Network;P:Pass;;');
      expect(result.primaryType).toBe('wifi');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should detect vCard contact', () => {
      const result = detectContentType('BEGIN:VCARD\nFN:John\nEND:VCARD');
      expect(result.primaryType).toBe('contact');
    });

    it('should default to text', () => {
      const result = detectContentType('just random text');
      expect(result.primaryType).toBe('text');
    });

    it('should return detected types array', () => {
      const result = detectContentType('https://example.com');
      expect(Array.isArray(result.detectedTypes)).toBe(true);
    });

    it('should throw error for non-string', () => {
      expect(() => detectContentType(123)).toThrow(TypeError);
    });
  });

  describe('getQRFeatures', () => {
    it('should return supported versions', () => {
      const features = getQRFeatures();
      expect(features.versions).toHaveLength(10);
      expect(features.versions[0]).toBe(1);
    });

    it('should return error correction levels', () => {
      const features = getQRFeatures();
      expect(features.errorCorrectionLevels).toContain('L');
      expect(features.errorCorrectionLevels).toContain('M');
      expect(features.errorCorrectionLevels).toContain('Q');
      expect(features.errorCorrectionLevels).toContain('H');
    });

    it('should return encoding modes', () => {
      const features = getQRFeatures();
      expect(features.encodingModes).toContain('numeric');
      expect(features.encodingModes).toContain('alphanumeric');
    });

    it('should return max version', () => {
      const features = getQRFeatures();
      expect(features.maxVersion).toBe(10);
    });

    it('should return max data capacity', () => {
      const features = getQRFeatures();
      expect(features.maxDataCapacity).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    it('should analyze and estimate version for URL', () => {
      const url = 'https://github.com/example';
      const analysis = analyzeQRContent(url);
      const estimated = estimateQRVersion(url);
      expect(estimated.fits).toBe(true);
      expect(estimated.mode).toBe(analysis.mode);
    });

    it('should detect and extract email from content', () => {
      const content = 'Contact: test@example.com';
      const detection = detectContentType(content);
      const extraction = extractEmail(content);
      expect(detection.primaryType).toBe('email');
      expect(extraction.found).toBe(true);
    });

    it('should handle WiFi extraction and analysis', () => {
      const wifi = 'WIFI:T:WPA;S:TestNet;P:Pass123;;';
      const detection = detectContentType(wifi);
      const extraction = extractWiFi(wifi);
      expect(detection.primaryType).toBe('wifi');
      expect(extraction.found).toBe(true);
    });

    it('should handle vCard analysis', () => {
      const vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:Jane Doe\nTEL:555-5678\nEND:VCARD';
      const detection = detectContentType(vcard);
      const extraction = extractContact(vcard);
      expect(detection.primaryType).toBe('contact');
      expect(extraction.found).toBe(true);
    });

    it('should validate and analyze QR image', () => {
      const base64 = 'SGVsbG8gV29ybGQ=';
      const valid = isValidQRData(base64);
      const decoded = decodeQRImage(base64);
      expect(valid).toBe(true);
      expect(decoded.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long content', () => {
      const longContent = 'A'.repeat(500);
      const analysis = analyzeQRContent(longContent);
      expect(analysis.estimatedDataBits).toBeGreaterThan(0);
    });

    it('should handle mixed case in error correction level', () => {
      const result = getErrorCorrectionLevel('m');
      expect(result.level).toBe('M');
    });

    it('should handle complex URLs', () => {
      const url = 'https://example.com/path?query=1&other=2#section';
      const result = extractURL(url);
      expect(result.found).toBe(true);
    });

    it('should handle emails with subdomains', () => {
      const email = 'user@mail.company.com';
      const result = extractEmail(email);
      expect(result.found).toBe(true);
      expect(result.domain).toBe('mail.company.com');
    });

    it('should handle phone with various formats', () => {
      const phones = [
        '+1-555-123-4567',
        '555-123-4567',
        '(555) 123-4567',
        '+1 555 123 4567',
      ];
      phones.forEach((phone) => {
        const result = extractPhone(phone);
        expect(result.found).toBe(true);
      });
    });

    it('should handle multiline vCard', () => {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:555-1234
EMAIL:john@example.com
ORG:Company
END:VCARD`;
      const result = extractContact(vcard);
      expect(result.found).toBe(true);
      expect(result.name).toBe('John Doe');
    });

    it('should handle empty WiFi fields', () => {
      const wifi = 'WIFI:T:;S:Network;P:;;';
      const result = extractWiFi(wifi);
      expect(result.ssid).toBe('Network');
    });

    it('should handle multiple content types in detection', () => {
      const content = 'Email: test@example.com URL: https://example.com';
      const detection = detectContentType(content);
      expect(detection.detectedTypes.length).toBeGreaterThan(1);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle GitHub URL in QR', () => {
      const url = 'https://github.com/Vetri-78640/-String-Encryption-Vault';
      const estimated = estimateQRVersion(url);
      expect(estimated.fits).toBe(true);
    });

    it('should handle business card vCard', () => {
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Alice Johnson
TITLE:Software Engineer
TEL:+1-555-987-6543
EMAIL:alice@techcorp.com
ORG:TechCorp Inc
END:VCARD`;
      const result = extractContact(vcard);
      expect(result.name).toBe('Alice Johnson');
      expect(result.email).toBe('alice@techcorp.com');
    });

    it('should handle WiFi QR code', () => {
      const wifi = 'WIFI:T:WPA;S:CoffeeShop;P:SecurePass2024;;';
      const extraction = extractWiFi(wifi);
      expect(extraction.found).toBe(true);
      expect(extraction.ssid).toBe('CoffeeShop');
    });

    it('should handle combined contact info', () => {
      const content = 'Contact: John Doe\nPhone: +1-555-123-4567\nEmail: john@example.com';
      const phone = extractPhone(content);
      const email = extractEmail(content);
      expect(phone.found).toBe(true);
      expect(email.found).toBe(true);
    });

    it('should estimate version for typical product URL', () => {
      const url = 'https://product.example.com/view/12345?ref=qr';
      const estimated = estimateQRVersion(url);
      expect(estimated.fits).toBe(true);
      expect(estimated.version).toBeGreaterThanOrEqual(1);
    });
  });
});
