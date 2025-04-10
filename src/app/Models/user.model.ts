import { product } from './product.model';

export interface user {
  id: string;
  name: string;
  email: string;
  thumbnail: string;
  favorites?: product[];
  cart?: product[];
}
