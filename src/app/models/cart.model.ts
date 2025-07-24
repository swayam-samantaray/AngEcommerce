import { ProductModel } from './product.model';

export interface CartItem {
  product: ProductModel;
  quantity: number;
}
