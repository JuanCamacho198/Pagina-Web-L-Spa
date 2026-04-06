import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

const CLOUDINARY_BREAKPOINTS = [320, 640, 1024, 1280] as const;

export type BreakpointWidth = (typeof CLOUDINARY_BREAKPOINTS)[number];

export interface CloudinaryUrlOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
}

export function getCloudinaryCloudName(): string | null {
  const cloudName = PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName === 'your-cloud-name' || cloudName === '') {
    return null;
  }
  return cloudName;
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

export function isLocalUrl(url: string): boolean {
  return url.startsWith('/') || url.startsWith('http://localhost');
}

export function buildCloudinaryUrl(
  publicId: string,
  options: CloudinaryUrlOptions = {}
): string {
  const cloudName = getCloudinaryCloudName();
  if (!cloudName) {
    return '';
  }

  const transformations: string[] = [];

  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }

  transformations.push('f_auto', 'q_auto');

  const transformString = transformations.join(',');

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const transformPart = transformString ? `/${transformString}` : '';
  
  return `${baseUrl}${transformPart}/${publicId}`;
}

export function buildSrcset(publicId: string): string {
  const cloudName = getCloudinaryCloudName();
  if (!cloudName) {
    return '';
  }

  const srcsetParts: string[] = [];

  for (const width of CLOUDINARY_BREAKPOINTS) {
    const url = buildCloudinaryUrl(publicId, { width });
    if (url) {
      srcsetParts.push(`${url} ${width}w`);
    }
  }

  return srcsetParts.join(', ');
}

export function getSizesAttribute(): string {
  return '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1280px';
}