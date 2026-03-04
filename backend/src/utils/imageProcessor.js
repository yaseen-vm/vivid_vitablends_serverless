import sharp from 'sharp';
import logger from './logger.js';

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
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return null;

  const mimeType = matches[1];
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(mimeType)) {
    throw Object.assign(
      new Error('Invalid image type. Allowed: JPEG, PNG, WebP'),
      {
        statusCode: 400,
        code: 'INVALID_IMAGE_TYPE',
      }
    );
  }

  const buffer = Buffer.from(matches[2], 'base64');
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (buffer.length > maxSize) {
    throw Object.assign(new Error('Image too large. Maximum size: 10MB'), {
      statusCode: 400,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  return buffer;
};
