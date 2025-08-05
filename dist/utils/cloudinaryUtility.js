"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedImageUrl = getSignedImageUrl;
// cloudinaryUtils.ts
const cloudinary_1 = require("cloudinary");
/**
 * Returns a signed Cloudinary image URL, valid for the specified duration.
 * @param publicId The Cloudinary public_id of the image.
 * @param expiresInSeconds How long (in seconds) the URL should be valid (default: 600 = 10 minutes).
 * @returns Signed image URL as a string.
 */
function getSignedImageUrl(publicId, expiresInSeconds = 600) {
    const expireAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return cloudinary_1.v2.url(publicId, {
        type: 'authenticated',
        secure: true,
        sign_url: true,
        expire_at: expireAt,
    });
}
