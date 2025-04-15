export interface Product {
  id: string;
  image: string;
  name: string;
  subTitle: string;
  price: number;
  categories: string[];
  date: Date;
  sale?: number;
  quantity: number;
  color: string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
}
