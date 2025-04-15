import { Product } from './product.model';

export interface User {
  id: string;
  name: string;
  email: string;
  thumbnail: string;
  favorites?: Product[];
}
