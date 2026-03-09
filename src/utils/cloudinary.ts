import { cloudinary } from '../lib/cloudinary';

export interface OptimizedUrlOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'thumb';
}

const DEFAULT_OPTIONS: OptimizedUrlOptions = {
  quality: 'auto',
  format: 'auto',
  crop: 'fill',
};

export const getOptimizedUrl = (
  publicId: string,
  options: OptimizedUrlOptions = {}
): string => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const { width, height, quality, format, crop } = mergedOptions;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  
  // Force f_auto and q_auto
  transformations.push(`q_${quality || 'auto'}`);
  transformations.push(`f_${format || 'auto'}`);

  if (crop) transformations.push(`c_${crop}`);

  const transformationString = transformations.join(',');

  return (cloudinary as any).url(publicId, {
    transformation: transformationString || undefined,
    secure: true,
  });
};

export const generateSrcSet = (
  publicId: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string => {
  return widths
    .map((w) => `${getOptimizedUrl(publicId, { width: w })} ${w}w`)
    .join(', ');
};

export const getResponsiveImageUrl = (
  publicId: string,
  options: OptimizedUrlOptions = {}
): { src: string; srcSet: string } => {
  const src = getOptimizedUrl(publicId, { ...options, width: options.width || 1280 });
  const srcSet = generateSrcSet(publicId);
  return { src, srcSet };
};
