import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss'],
})
export class Checkout {
  checkoutForm: FormGroup;
  items: CartItem[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private productService: ProductService
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{16}$/)],
      ],
      expiration: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]],
    });

    //  Use CartService instead of localStorage
    this.items = this.cartService.getItems();
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      console.log('Order placed:', this.checkoutForm.value);
      alert('Order placed successfully!');

      //  Update stock
      this.items.forEach((item) => {
        const productId = item.product?.id;
        const qty = item.quantity;
        if (productId != null) {
          this.productService.deductStockFromCartItems(this.items);
        }
      });

      //  Clear cart and update count
      this.cartService.clearCart();
      this.cartService.updateItemCount();

      this.router.navigate(['/order-success']);
    }
  }

  get total(): number {
    return this.cartService.getTotal();
  }
}
