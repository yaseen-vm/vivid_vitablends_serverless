import * as imageRepository from '../repositories/image.repository.js';
import { parseBase64Image } from '../utils/imageProcessor.js';
import { getHonoContext } from '../utils/context.js';
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

  const matches = base64Image.match(
    /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-]+);base64,/
  );
  const contentType = matches ? matches[1].toLowerCase() : 'image/jpeg';
  let ext = 'jpg';
  if (contentType === 'image/png') ext = 'png';
  if (contentType === 'image/webp') ext = 'webp';

  const c = getHonoContext();
  const pathPrefix = c?.env?.R2_PATH_PREFIX || 'products/';
  const publicBucketId = c?.env?.R2_PUBLIC_BUCKET_ID || 'default-bucket-id';

  const key = `${pathPrefix}${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;

  await imageRepository.uploadToS3(buffer, key, contentType);
  const url = `https://pub-${publicBucketId}.r2.dev/${key}`;

  logger.info('Image uploaded successfully', { key });
  return url;
};
