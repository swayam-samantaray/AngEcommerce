import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule,RouterModule],
  template: `
    <div class="container mt-4">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Thank you for shopping with us.</p>
      <a routerLink="/" class="btn btn-primary">Go to Home</a>
    </div>
  `
})
export class OrderSuccess {}
