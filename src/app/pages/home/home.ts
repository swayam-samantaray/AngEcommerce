import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { ProductModel } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./home.scss'],
  standalone: true,
})
export class Home implements OnInit {
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  searchText = '';
  currentPage = 1;
  pageSize = 4;
  selectedCategory: string = 'All';
  maxPrice: number = 0;
  categories: string[] = [];
  itemsInCart: Set<number> = new Set();

  constructor(
    private product: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  navigateToProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }
  async ngOnInit() {
    this.products = await this.product.getProducts();

    this.applyFilter();

    this.categories = Array.from(new Set(this.products.map((p) => p.category)));
    this.maxPrice = Math.max(
      ...this.products.map((p) => p.discount_price || p.price)
    );

    const cartItems = this.cartService.getItems();
    for (const item of cartItems) {
      this.itemsInCart.add(item.product.id);
    }
  }

  handleCartClick(product: ProductModel): void {
    if (this.itemsInCart.has(product.id)) {
      this.router.navigate(['/cart']);
    } else {
      this.cartService.addToCart(product);
      this.itemsInCart.add(product.id);
      console.log('Added to cart:', this.cartService.getItems());
    }
  }

  addToCart(product: ProductModel): void {
    this.cartService.addToCart(product);
    console.log('Added to cart:', this.cartService.getItems());
  }

  applyFilter(): void {
    const query = this.searchText.toLowerCase();
    this.filteredProducts = this.products.filter(
      (p) =>
        (p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)) &&
        (this.selectedCategory === 'All' ||
          p.category === this.selectedCategory) &&
        (this.maxPrice === 0 || (p.discount_price || p.price) <= this.maxPrice)
    );
    this.currentPage = 1;
  }

  get paginatedProducts(): ProductModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  getDiscountPercentage(product: ProductModel): number {
    if (product.discount_price < product.price) {
      return Math.round(
        ((product.price - product.discount_price) / product.price) * 100
      );
    }
    return 0;
  }

  getMaxPrice(): number {
    if (!this.products || this.products.length === 0) return 0;
    return Math.max(...this.products.map((p) => p.discount_price || p.price));
  }

  isInCart(productId: number): boolean {
    return this.itemsInCart.has(productId);
  }
}
