// cloudinaryUtils.ts
import { v2 as cloudinary } from 'cloudinary';

/**
 * Returns a signed Cloudinary image URL, valid for the specified duration.
 * @param publicId The Cloudinary public_id of the image.
 * @param expiresInSeconds How long (in seconds) the URL should be valid (default: 600 = 10 minutes).
 * @returns Signed image URL as a string.
 */
export function getSignedImageUrl(publicId: string, expiresInSeconds = 600): string {
  const expireAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return cloudinary.url(publicId, {
    type: 'authenticated',
    secure: true,
    sign_url: true,
    expire_at: expireAt,
  });
}
