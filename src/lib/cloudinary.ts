import { Cloudinary } from 'cloudinary-core';

export const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  secure: true
});

// Función útil para obtener las URLs de las imágenes
export const getCloudinaryUrl = (publicId: string) => {
  return cloudinary.url(publicId);
};
