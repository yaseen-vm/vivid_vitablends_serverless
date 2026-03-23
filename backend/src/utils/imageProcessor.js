import logger from './logger.js';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
// Base64 encodes 3 bytes → 4 chars, so max base64 length for 10MB:
const MAX_BASE64_LENGTH = Math.ceil(MAX_IMAGE_BYTES / 3) * 4;

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const detectImageFormat = (buffer) => {
  if (!buffer || buffer.byteLength < 12) return null;

  const arr = new Uint8Array(buffer);
  // JPEG: FF D8 FF
  if (arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff) {
    return 'jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    arr[0] === 0x89 &&
    arr[1] === 0x50 &&
    arr[2] === 0x4e &&
    arr[3] === 0x47 &&
    arr[4] === 0x0d &&
    arr[5] === 0x0a &&
    arr[6] === 0x1a &&
    arr[7] === 0x0a
  ) {
    return 'png';
  }

  // WebP: RIFF????WEBP
  if (
    String.fromCharCode(...arr.subarray(0, 4)) === 'RIFF' &&
    String.fromCharCode(...arr.subarray(8, 12)) === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
};

// No longer using sharp to process. Return buffer directly.
export const processImage = async (buffer) => {
  return buffer;
};

export const parseBase64Image = (base64Image) => {
  if (typeof base64Image !== 'string' || !base64Image) {
    throw Object.assign(new Error('Invalid base64 image data'), {
      statusCode: 400,
      code: 'INVALID_INPUT',
    });
  }

  const matches = base64Image.match(
    /^data:([a-zA-Z0-9][a-zA-Z0-9!#$&\-^_]+\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_]+);base64,([A-Za-z0-9+/]*={0,2})$/
  );
  if (!matches) {
    throw Object.assign(new Error('Malformed data URL'), {
      statusCode: 400,
      code: 'INVALID_INPUT',
    });
  }

  const mimeType = matches[1].toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw Object.assign(
      new Error('Invalid image type. Allowed: JPEG, PNG, WebP'),
      { statusCode: 400, code: 'INVALID_IMAGE_TYPE' }
    );
  }

  const base64Data = matches[2];

  if (base64Data.length > MAX_BASE64_LENGTH) {
    throw Object.assign(new Error('Image too large. Maximum size: 10MB'), {
      statusCode: 400,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  // Use standard Web-compatible base64 decoding to support Edge runtimes
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const buffer = bytes.buffer;

  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error('Image too large. Maximum size: 10MB'), {
      statusCode: 400,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  const detectedFormat = detectImageFormat(buffer);
  if (!detectedFormat) {
    throw Object.assign(
      new Error(
        'Image content does not match a supported format (JPEG, PNG, WebP)'
      ),
      { statusCode: 400, code: 'INVALID_IMAGE_FORMAT' }
    );
  }

  return buffer;
};
