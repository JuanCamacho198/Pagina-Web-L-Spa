import React, { useState } from 'react';
import { getOptimizedUrl, generateSrcSet, OptimizedUrlOptions } from '../utils/cloudinary';

interface CloudinaryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  publicId: string;
  options?: OptimizedUrlOptions;
  sizes?: string;
  showPlaceholder?: boolean;
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  options = {},
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  showPlaceholder = true,
  alt,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const src = getOptimizedUrl(publicId, options);
  const srcSet = generateSrcSet(publicId, [320, 640, 960, 1280]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className || ''}`}
        style={{ aspectRatio: options.height && options.width ? `${options.width}/${options.height}` : '16/9' }}
      >
        <span className="text-gray-400 text-sm">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <>
      {showPlaceholder && !isLoaded && (
        <div
          className={`animate-pulse bg-gray-200 ${className || ''}`}
          style={{ aspectRatio: options.height && options.width ? `${options.width}/${options.height}` : '16/9' }}
        />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt || ''}
        className={`${className || ''} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </>
  );
};

export default CloudinaryImage;
