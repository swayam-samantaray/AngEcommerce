import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from '../services/product';
import { CartItem } from '../models/cart.model';
import { ProductModel } from '../models/product.model';
import { CommonModule } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private itemCountSubject = new BehaviorSubject<number>(0);
  itemCount$ = this.itemCountSubject.asObservable();

  constructor() {
    // this.loadCart(); // Load from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.items = JSON.parse(storedCart);
    }
    this.updateItemCount(); // Emit initial count
  }

  public updateItemCount(): void {
    const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.itemCountSubject.next(count);
  }

  public saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  getItems(): CartItem[] {
    return this.items;
  }

  // getCart() {
  //   return this.cartSubject.asObservable();
  // }

  addToCart(product: ProductModel) {
    if (!product || !product.id) {
      console.error('Invalid product passed to addToCart:', product);
      return;
    }
    const existing = this.items.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.saveCart();
    this.updateItemCount();
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.saveCart();
    this.updateItemCount();
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateItemCount();
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      if (!item.product || typeof item.product.price !== 'number') return total;
      return total + item.product.price * item.quantity;
    }, 0);
  }
}
