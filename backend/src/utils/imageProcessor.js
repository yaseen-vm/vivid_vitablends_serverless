import sharp from 'sharp';
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

/**
 * Validates raw buffer magic bytes against known image signatures.
 * Returns the detected format name or null if unrecognised.
 */
const detectImageFormat = (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'png';
  }

  // WebP: RIFF????WEBP (bytes 0-3 = 'RIFF', bytes 8-11 = 'WEBP')
  if (
    buffer.subarray(0, 4).toString('binary') === 'RIFF' &&
    buffer.subarray(8, 12).toString('binary') === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
};

export const processImage = async (buffer) => {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (metadata.hasAlpha) {
    logger.info('Processing image with transparency as PNG');
    return image
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 85 })
      .toBuffer();
  }

  logger.info('Processing image as JPEG');
  return image
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
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

  // Guard against memory exhaustion before allocating the buffer
  if (base64Data.length > MAX_BASE64_LENGTH) {
    throw Object.assign(new Error('Image too large. Maximum size: 10MB'), {
      statusCode: 400,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  // Decode — Buffer.from with explicit encoding is safe binary decoding, not deserialization
  const buffer = Buffer.from(base64Data, 'base64');

  // Post-decode size guard (base64 padding can slightly skew pre-decode estimates)
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error('Image too large. Maximum size: 10MB'), {
      statusCode: 400,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  // Verify magic bytes — ensures the payload matches its declared MIME type
  const detectedFormat = detectImageFormat(buffer);
  if (!detectedFormat) {
    throw Object.assign(
      new Error(
        'Image content does not match a supported format (JPEG, PNG, WebP)'
      ),
      { statusCode: 400, code: 'INVALID_IMAGE_FORMAT' }
    );
  }

  // Cross-check declared MIME type against detected format
  const mimeMatchesFormat =
    (detectedFormat === 'jpeg' &&
      (mimeType === 'image/jpeg' || mimeType === 'image/jpg')) ||
    (detectedFormat === 'png' && mimeType === 'image/png') ||
    (detectedFormat === 'webp' && mimeType === 'image/webp');

  if (!mimeMatchesFormat) {
    throw Object.assign(
      new Error('Declared MIME type does not match actual image format'),
      { statusCode: 400, code: 'MIME_MISMATCH' }
    );
  }

  return buffer;
};
