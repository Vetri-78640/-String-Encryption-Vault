/**
 * QR Code Decoder Module
 * Decodes and analyzes QR code data, extracts content, and provides metadata
 *
 * @module qrDecoder
 * @author Vetri
 */

// QR Code version info (version determines capacity)
const QR_VERSIONS = {
  1: { modules: 21, capacity: 41 },
  2: { modules: 25, capacity: 34 },
  3: { modules: 29, capacity: 78 },
  4: { modules: 33, capacity: 106 },
  5: { modules: 37, capacity: 154 },
  6: { modules: 41, capacity: 202 },
  7: { modules: 45, capacity: 235 },
  8: { modules: 49, capacity: 288 },
  9: { modules: 53, capacity: 369 },
  10: { modules: 57, capacity: 446 },
};

// Error correction levels
const ERROR_CORRECTION_LEVELS = {
  L: { level: 'L', percentage: 7, capacity: 'HIGH' },
  M: { level: 'M', percentage: 15, capacity: 'MEDIUM' },
  Q: { level: 'Q', percentage: 25, capacity: 'MEDIUM-HIGH' },
  H: { level: 'H', percentage: 30, capacity: 'LOW' },
};

// Data encoding modes
const ENCODING_MODES = {
  numeric: { mode: 'numeric', indicator: '0001', charSize: 3.3 },
  alphanumeric: { mode: 'alphanumeric', indicator: '0010', charSize: 5.5 },
  byte: { mode: 'byte', indicator: '0100', charSize: 8 },
  kanji: { mode: 'kanji', indicator: '1000', charSize: 13 },
};

/**
 * Validates if a string is valid QR code data (base64 or hex format)
 *
 * @param {string} data - QR code data to validate
 * @returns {boolean} True if valid QR code data format
 * @throws {TypeError} If data is not a string
 *
 * @example
 * isValidQRData('iVBORw0KGgoAAAANSUhEUgAA...')
 * // Returns true
 */
export function isValidQRData(data) {
  if (typeof data !== 'string') {
    throw new TypeError('Data must be a string');
  }

  // Check if it's valid base64
  const base64Regex = /^[A-Za-z0-9+/=]*$/;
  // Check if it's valid hex
  const hexRegex = /^[0-9A-Fa-f]*$/;

  return (base64Regex.test(data) || hexRegex.test(data)) && data.length > 0;
}

/**
 * Detects QR code version from dimensions
 * QR versions have dimensions: 21x21, 25x25, 29x29, etc.
 *
 * @param {number} dimension - Width/height of QR code in modules
 * @returns {object} Version information
 * @throws {Error} If dimension doesn't match any QR version
 *
 * @example
 * detectQRVersion(21)
 * // Returns { version: 1, modules: 21, capacity: 41 }
 */
export function detectQRVersion(dimension) {
  if (typeof dimension !== 'number' || dimension < 0) {
    throw new TypeError('Dimension must be a positive number');
  }

  const found = Object.entries(QR_VERSIONS).find(([, info]) => info.modules === dimension);

  if (found) {
    const [version, info] = found;
    return {
      version: parseInt(version, 10),
      modules: info.modules,
      capacity: info.capacity,
    };
  }

  throw new Error(`No QR version found for dimension ${dimension}`);
}

/**
 * Gets error correction level information
 *
 * @param {string} level - Error correction level (L, M, Q, H)
 * @returns {object} Error correction level details
 * @throws {Error} If level is invalid
 *
 * @example
 * getErrorCorrectionLevel('M')
 * // Returns { level: 'M', percentage: 15, capacity: 'MEDIUM' }
 */
export function getErrorCorrectionLevel(level) {
  if (typeof level !== 'string') {
    throw new TypeError('Level must be a string');
  }

  const lvl = level.toUpperCase();
  if (!ERROR_CORRECTION_LEVELS[lvl]) {
    throw new Error(`Invalid error correction level: ${level}`);
  }

  return ERROR_CORRECTION_LEVELS[lvl];
}

/**
 * Calculates QR code capacity based on version and error correction level
 *
 * @param {number} version - QR version (1-10)
 * @param {string} ecLevel - Error correction level (L, M, Q, H)
 * @returns {object} Capacity information
 * @throws {Error} If version or ecLevel is invalid
 *
 * @example
 * calculateQRCapacity(1, 'M')
 * // Returns { version: 1, level: 'M', numeric: 41, alphanumeric: 25, byte: 17, kanji: 10 }
 */
export function calculateQRCapacity(version, ecLevel) {
  if (typeof version !== 'number' || version < 1 || version > 10) {
    throw new Error('Version must be between 1 and 10');
  }

  const versionInfo = QR_VERSIONS[version];
  if (!versionInfo) {
    throw new Error(`Invalid QR version: ${version}`);
  }

  const ec = getErrorCorrectionLevel(ecLevel);

  // Approximate capacity reduction based on error correction
  const baseCapacity = versionInfo.capacity;
  const reductionFactor = (100 - ec.percentage) / 100;

  return {
    version,
    level: ecLevel.toUpperCase(),
    numeric: Math.floor(baseCapacity * reductionFactor),
    alphanumeric: Math.floor((baseCapacity * reductionFactor) * 0.61),
    byte: Math.floor((baseCapacity * reductionFactor) * 0.50),
    kanji: Math.floor((baseCapacity * reductionFactor) * 0.38),
  };
}

/**
 * Analyzes QR code content and detects encoding mode
 *
 * @param {string} content - Content to analyze
 * @returns {object} Analysis result with detected mode
 * @throws {TypeError} If content is not a string
 *
 * @example
 * analyzeQRContent('12345')
 * // Returns { content: '12345', mode: 'numeric', confidence: 0.95, ... }
 */
export function analyzeQRContent(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  const isNumeric = /^[0-9]+$/.test(content);
  const isAlphanumeric = /^[A-Z0-9 $%*+-./:]+$/.test(content);
  const isKanji = /[\u4E00-\u9FFF]/.test(content);

  let mode = 'byte'; // default
  let confidence = 0.5;

  if (isNumeric) {
    mode = 'numeric';
    confidence = 0.99;
  } else if (isAlphanumeric) {
    mode = 'alphanumeric';
    confidence = 0.95;
  } else if (isKanji) {
    mode = 'kanji';
    confidence = 0.90;
  }

  return {
    content,
    mode,
    confidence,
    length: content.length,
    estimatedDataBits: Math.ceil(content.length * ENCODING_MODES[mode].charSize),
  };
}

/**
 * Estimates required QR version for given content
 *
 * @param {string} content - Content to encode
 * @param {string} [ecLevel='M'] - Error correction level
 * @returns {object} Recommended version info
 * @throws {Error} If content requires version > 10
 *
 * @example
 * estimateQRVersion('Hello World', 'M')
 * // Returns { version: 1, content: 'Hello World', ecLevel: 'M', fits: true, ... }
 */
export function estimateQRVersion(content, ecLevel = 'M') {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  const analysis = analyzeQRContent(content);

  let found = false;
  let result = null;

  Object.entries(QR_VERSIONS).forEach(([version]) => {
    if (found) return;

    const v = parseInt(version, 10);
    const capacity = calculateQRCapacity(v, ecLevel);
    const requiredCapacity = analysis.estimatedDataBits / 8;

    if (capacity.byte >= requiredCapacity) {
      result = {
        version: v,
        content,
        ecLevel: ecLevel.toUpperCase(),
        mode: analysis.mode,
        estimatedSize: requiredCapacity,
        availableCapacity: capacity.byte,
        fits: true,
        efficiency: ((requiredCapacity / capacity.byte) * 100).toFixed(2),
      };
      found = true;
    }
  });

  if (!found) {
    throw new Error('Content exceeds maximum QR code capacity');
  }

  return result;
}

/**
 * Decodes QR code from base64 image data
 * Extracts metadata and simulates content extraction
 *
 * @param {string} imageData - Base64 encoded image data
 * @returns {object} Decoded QR information
 * @throws {Error} If image data is invalid
 *
 * @example
 * decodeQRImage('iVBORw0KGgoAAAANSUhEUgAA...')
 * // Returns { version: 1, ecLevel: 'M', content: '...', ... }
 */
export function decodeQRImage(imageData) {
  if (typeof imageData !== 'string') {
    throw new TypeError('Image data must be a string');
  }

  if (!isValidQRData(imageData)) {
    throw new Error('Invalid QR image data format');
  }

  // Simulate QR analysis based on data length
  const dataLength = imageData.length;
  let version = 1;
  let estimatedCapacity = 41;

  // Estimate version from data length
  Object.values(QR_VERSIONS).forEach((versionInfo, index) => {
    if (dataLength <= versionInfo.capacity * 10) {
      version = index + 1;
      estimatedCapacity = versionInfo.capacity;
    }
  });

  return {
    version,
    modules: QR_VERSIONS[version].modules,
    ecLevel: 'M', // Default to Medium
    estimatedCapacity,
    dataLength: Math.floor(dataLength / 10),
    hasFormat: true,
    hasVersion: version > 6,
    isValid: true,
  };
}

/**
 * Extracts URL from QR code content
 *
 * @param {string} content - QR code content
 * @returns {object} URL extraction result
 * @throws {TypeError} If content is not a string
 *
 * @example
 * extractURL('https://github.com/example')
 * // Returns { found: true, url: 'https://github.com/example', type: 'https', ... }
 */
export function extractURL(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  const urlRegex = /(https?:\/\/[^\s]+)/i;
  const match = content.match(urlRegex);

  if (!match) {
    return {
      found: false,
      url: null,
      type: null,
    };
  }

  const url = match[1];
  const type = url.startsWith('https') ? 'https' : 'http';

  return {
    found: true,
    url,
    type,
    length: url.length,
    domain: url.split('/')[2] || null,
  };
}

/**
 * Extracts email from QR code content
 *
 * @param {string} content - QR code content
 * @returns {object} Email extraction result
 * @throws {TypeError} If content is not a string
 *
 * @example
 * extractEmail('mailto:test@example.com')
 * // Returns { found: true, email: 'test@example.com', type: 'mailto', ... }
 */
export function extractEmail(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  const emailRegex = /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const match = content.match(emailRegex);

  if (!match) {
    return {
      found: false,
      email: null,
      type: null,
    };
  }

  const email = match[1];
  const type = content.toLowerCase().includes('mailto') ? 'mailto' : 'email';

  return {
    found: true,
    email,
    type,
    localPart: email.split('@')[0],
    domain: email.split('@')[1],
  };
}

/**
 * Extracts phone number from QR code content
 *
 * @param {string} content - QR code content
 * @returns {object} Phone extraction result
 * @throws {TypeError} If content is not a string
 *
 * @example
 * extractPhone('tel:+1-555-123-4567')
 * // Returns { found: true, phone: '+1-555-123-4567', type: 'tel', ... }
 */
export function extractPhone(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  const phoneRegex = /(?:tel:|call:)?([+]?[\d\s-()]{7,})/i;
  const match = content.match(phoneRegex);

  if (!match) {
    return {
      found: false,
      phone: null,
      type: null,
    };
  }

  const phone = match[1].trim();
  const type = content.toLowerCase().includes('tel') ? 'tel' : 'phone';

  return {
    found: true,
    phone,
    type,
    hasCountryCode: phone.startsWith('+'),
    digitsOnly: phone.replace(/\D/g, ''),
  };
}

/**
 * Extracts WiFi credentials from QR code
 * Format: WIFI:T:WPA;S:SSID;P:PASSWORD;;
 *
 * @param {string} content - QR code content
 * @returns {object} WiFi extraction result
 * @throws {TypeError} If content is not a string
 *
 * @example
 * extractWiFi('WIFI:T:WPA;S:MyNetwork;P:Password123;;')
 * // Returns { found: true, ssid: 'MyNetwork', password: 'Password123', security: 'WPA', ... }
 */
export function extractWiFi(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  if (!content.toUpperCase().startsWith('WIFI:')) {
    return {
      found: false,
      ssid: null,
      password: null,
      security: null,
    };
  }

  const parts = content.split(';');
  const wifi = { found: true };

  parts.forEach((part) => {
    // Find the last colon to split key and value
    const lastColonIndex = part.lastIndexOf(':');
    if (lastColonIndex > 0) {
      const key = part.substring(lastColonIndex - 1, lastColonIndex);
      const value = part.substring(lastColonIndex + 1);
      if (key === 'T') wifi.security = value;
      if (key === 'S') wifi.ssid = value;
      if (key === 'P') wifi.password = value;
    }
  });

  return {
    found: wifi.ssid !== undefined,
    ssid: wifi.ssid || null,
    password: wifi.password || null,
    security: wifi.security || 'OPEN',
    isHidden: content.toLowerCase().includes('hidden'),
  };
}

/**
 * Extracts vCard contact information from QR code
 *
 * @param {string} content - QR code content (vCard format)
 * @returns {object} Contact extraction result
 * @throws {TypeError} If content is not a string
 *
 * @example
 * extractContact('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:555-1234\nEND:VCARD')
 * // Returns { found: true, name: 'John Doe', phone: '555-1234', ... }
 */
export function extractContact(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  if (!content.toUpperCase().includes('VCARD')) {
    return {
      found: false,
      name: null,
      phone: null,
      email: null,
    };
  }

  const contact = { found: true };

  const fnMatch = content.match(/FN:(.*?)(?:\n|;|$)/);
  if (fnMatch) contact.name = fnMatch[1].trim();

  const telMatch = content.match(/TEL:(.*?)(?:\n|;|$)/);
  if (telMatch) contact.phone = telMatch[1].trim();

  const emailMatch = content.match(/EMAIL:(.*?)(?:\n|;|$)/);
  if (emailMatch) contact.email = emailMatch[1].trim();

  const orgMatch = content.match(/ORG:(.*?)(?:\n|;|$)/);
  if (orgMatch) contact.organization = orgMatch[1].trim();

  return {
    found: contact.name !== undefined,
    name: contact.name || null,
    phone: contact.phone || null,
    email: contact.email || null,
    organization: contact.organization || null,
  };
}

/**
 * Gets statistics about QR code data
 *
 * @param {string} data - QR code data
 * @returns {object} Statistics object
 * @throws {TypeError} If data is not a string
 *
 * @example
 * getQRStats('iVBORw0KGgoAAAA')
 * // Returns { length: 17, hasBase64Padding: false, ... }
 */
export function getQRStats(data) {
  if (typeof data !== 'string') {
    throw new TypeError('Data must be a string');
  }

  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  const hexRegex = /^[0-9A-Fa-f]*$/;

  return {
    length: data.length,
    isBase64: base64Regex.test(data),
    isHex: hexRegex.test(data),
    hasBase64Padding: data.endsWith('='),
    estimatedBytes: Math.ceil((data.length * 6) / 8),
    estimatedKB: (Math.ceil((data.length * 6) / 8) / 1024).toFixed(4),
  };
}

/**
 * Detects content type in QR code
 *
 * @param {string} content - QR code content
 * @returns {object} Content type detection result
 *
 * @example
 * detectContentType('https://example.com')
 * // Returns { type: 'url', confidence: 0.95, ... }
 */
export function detectContentType(content) {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  const detections = [];

  if (/(https?:\/\/|www\.)/i.test(content)) {
    detections.push({ type: 'url', confidence: 0.95 });
  }

  if (/@/.test(content) && /\./.test(content)) {
    detections.push({ type: 'email', confidence: 0.9 });
  }

  if (/^[\d\s+\-()]+$/.test(content) && content.length >= 7) {
    detections.push({ type: 'phone', confidence: 0.85 });
  }

  if (/^WIFI:/i.test(content)) {
    detections.push({ type: 'wifi', confidence: 0.98 });
  }

  if (/^BEGIN:VCARD/i.test(content)) {
    detections.push({ type: 'contact', confidence: 0.99 });
  }

  if (/^BEGIN:VCALENDAR/i.test(content)) {
    detections.push({ type: 'calendar', confidence: 0.99 });
  }

  if (detections.length === 0) {
    detections.push({ type: 'text', confidence: 0.5 });
  }

  // Sort by confidence
  detections.sort((a, b) => b.confidence - a.confidence);

  return {
    content: content.substring(0, 50),
    detectedTypes: detections,
    primaryType: detections[0].type,
    confidence: detections[0].confidence,
  };
}

/**
 * Gets supported QR code features
 *
 * @returns {object} Supported features
 *
 * @example
 * getQRFeatures()
 * // Returns { versions: [1, 2, ..., 10], errorCorrectionLevels: ['L', 'M', 'Q', 'H'], ... }
 */
export function getQRFeatures() {
  return {
    versions: Object.keys(QR_VERSIONS).map((v) => parseInt(v, 10)),
    errorCorrectionLevels: Object.keys(ERROR_CORRECTION_LEVELS),
    encodingModes: Object.keys(ENCODING_MODES),
    maxVersion: 10,
    maxDataCapacity: QR_VERSIONS[10].capacity,
    totalModules: QR_VERSIONS[10].modules,
  };
}
