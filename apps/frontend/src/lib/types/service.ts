export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  category?: string;
  imageUrl?: string;
  image_url?: string;
  imageFileName?: string;
  duration?: number;
}
