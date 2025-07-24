import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product';
import { ProductModel } from '../models/product.model';

@Component({
  selector: 'app-stockdetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stockdetails.html',
  styleUrl: './stockdetails.scss',
})
export class Stockdetails implements OnInit {
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  searchText: string = '';
  newProduct: Partial<ProductModel> = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.products = await this.productService.getProducts();
    this.filteredProducts = this.products;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productService.deleteProduct(id);
    await this.loadProducts();
  }

  editProduct(productId: number): void {
    this.router.navigate(['/addstock', productId]);
  }

  navigateToViewDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  filterProducts(): void {
    const search = this.searchText.toLowerCase();
    this.filteredProducts = this.products.filter(
      (p) =>
        p.name?.toLowerCase().includes(search) ||
        p.category?.toLowerCase().includes(search) ||
        p.price?.toString().includes(search) ||
        p.id?.toString().includes(search)
    );
  }
}
