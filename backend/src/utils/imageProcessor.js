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
  return Buffer.from(matches[2], 'base64');
};
