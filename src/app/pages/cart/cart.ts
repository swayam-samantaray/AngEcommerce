import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { CartItem } from '../../models/cart.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getItems();
    this.calculateTotal();
    console.log(this.cartItems);
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.cartService.saveCart();
    this.calculateTotal();
    this.cartService.updateItemCount();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.saveCart();
    } else {
      this.removeItem(item.product.id);
    }
    this.calculateTotal();
    this.cartService.updateItemCount();
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.cartItems = this.cartService.getItems();
    this.calculateTotal();
    this.cartService.updateItemCount();
  }

  calculateTotal(): void {
    this.total = this.cartService.getTotal();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }
}
