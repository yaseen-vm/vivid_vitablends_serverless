import crypto from 'crypto';
import sharp from 'sharp';
import * as imageRepository from '../repositories/image.repository.js';
import { parseBase64Image, processImage } from '../utils/imageProcessor.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

export const upload = async (base64Image) => {
  const buffer = parseBase64Image(base64Image);

  if (!buffer) {
    logger.warn('Invalid base64 image format provided');
    throw Object.assign(new Error('Invalid base64 image format'), {
      statusCode: 400,
      code: 'INVALID_IMAGE_FORMAT',
    });
  }

  logger.info('Processing image for upload');
  const optimizedBuffer = await processImage(buffer);
  const metadata = await sharp(optimizedBuffer).metadata();
  const ext = metadata.format === 'png' ? 'png' : 'jpg';
  const contentType = metadata.format === 'png' ? 'image/png' : 'image/jpeg';
  const key = `${config.r2.pathPrefix}${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;

  await imageRepository.uploadToS3(optimizedBuffer, key, contentType);
  const url = `https://pub-${config.r2.publicBucketId}.r2.dev/${key}`;

  logger.info('Image uploaded successfully', { key });
  return url;
};
