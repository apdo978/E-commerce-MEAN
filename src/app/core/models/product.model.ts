export interface Product {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  rating?: {
    rate: number;
    count: number;
  };
  qunt: number;
  createdAt?: Date;
  updatedAt?: Date;
} 