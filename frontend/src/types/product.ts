export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  category?: { id: string; name: string };
  featured?: boolean;
  badge?: string;
  originalPrice?: number;
};
