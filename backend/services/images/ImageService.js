/**
 * Image storage provider abstraction.
 * Switch IMAGE_PROVIDER env: local | cloudinary | s3 | firebase
 */

import path from 'path';
import fs from 'fs';

class LocalImageProvider {
  getUploadDir() {
    return path.join(process.cwd(), 'uploads', 'products');
  }

  buildPublicUrl(req, filename) {
    const host = req.get('host');
    const protocol = req.protocol;
    return `${protocol}://${host}/uploads/products/${filename}`;
  }

  buildUrlsFromFiles(req, files) {
    if (!files?.length) return [];
    return files.map(f => this.buildPublicUrl(req, f.filename));
  }

  async deleteImage(imageUrl) {
    if (!imageUrl?.includes('/uploads/products/')) return;
    const filename = path.basename(imageUrl);
    const filePath = path.join(this.getUploadDir(), filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

class CloudinaryProvider {
  buildUrlsFromFiles() { throw new Error('Cloudinary not configured. Set CLOUDINARY_URL.'); }
  async deleteImage() { throw new Error('Cloudinary not configured.'); }
}

class S3Provider {
  buildUrlsFromFiles() { throw new Error('AWS S3 not configured. Set AWS_S3_BUCKET.'); }
  async deleteImage() { throw new Error('AWS S3 not configured.'); }
}

class FirebaseStorageProvider {
  buildUrlsFromFiles() { throw new Error('Firebase Storage not configured.'); }
  async deleteImage() { throw new Error('Firebase Storage not configured.'); }
}

const providers = {
  local: LocalImageProvider,
  cloudinary: CloudinaryProvider,
  s3: S3Provider,
  firebase: FirebaseStorageProvider
};

function getProvider() {
  const name = (process.env.IMAGE_PROVIDER || 'local').toLowerCase();
  const Provider = providers[name] || LocalImageProvider;
  return new Provider();
}

export function buildImageUrlsFromFiles(req) {
  const files = req.files || (req.file ? [req.file] : []);
  return getProvider().buildUrlsFromFiles(req, files);
}

export async function deleteImage(imageUrl) {
  return getProvider().deleteImage(imageUrl);
}

export default { buildImageUrlsFromFiles, deleteImage };
