import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/s3.js';
import config from '../config/index.js';

export const uploadToS3 = async (buffer, key, contentType = 'image/jpeg') => {
  if (!s3Client) {
    throw Object.assign(new Error('S3 client not initialized'), {
      statusCode: 503,
      code: 'S3_CLIENT_NOT_INITIALIZED',
    });
  }
  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
};
