import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { HttpClient } from '@angular/common/http';

const STORAGE_KEY = 'products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: ProductModel[] = [];
  private initialized = false;

  constructor(private http: HttpClient) {}

  private loadInitialData(): Promise<void> {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.products = JSON.parse(stored);
        this.initialized = true;
        resolve();
      } else {
        this.http
          .get<ProductModel[]>('assets/products.json')
          .subscribe((data) => {
            this.products = data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            this.initialized = true;
            resolve();
          });
      }
    });
  }

  async getProducts(): Promise<ProductModel[]> {
    if (!this.initialized) await this.loadInitialData();
    return this.products;
  }

  async getProductdetailsById(id: number): Promise<ProductModel | undefined> {
    if (!this.initialized) await this.loadInitialData();
    return this.products.find((p) => p.id === id);
  }

  async deleteProduct(id: number): Promise<void> {
    if (!this.initialized) await this.loadInitialData();
    this.products = this.products.filter((p) => p.id !== id);
    this.saveToLocalStorage();
  }

  async addProduct(product: ProductModel): Promise<void> {
    if (!this.initialized) await this.loadInitialData();
    product.id = this.getNextId();
    this.products.push(product);
    this.saveToLocalStorage();
  }

  async updateProduct(updated: ProductModel): Promise<void> {
    if (!this.initialized) await this.loadInitialData();

    if (updated?.id == null) {
      console.error('Invalid product ID for update.');
      return;
    }

    const index = this.products.findIndex((p) => p.id === updated.id);
    if (index > -1) {
      this.products[index] = updated;
      this.saveToLocalStorage();
      console.log(`Product with ID ${updated.id} updated successfully.`);
    } else {
      console.warn(`Product with ID ${updated.id} not found.`);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products));
  }

  public getNextId(): number {
    return this.products.length > 0
      ? Math.max(...this.products.map((p) => p.id)) + 1
      : 1;
  }

  getProductById(id: number): ProductModel | undefined {
    return this.products.find((p) => p.id === id);
  }

  async updateProductBalanceQuantity(
    productId: number,
    newBalance: number
  ): Promise<void> {
    if (!this.initialized) await this.loadInitialData();

    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      console.warn(`Product with ID ${productId} not found.`);
      return;
    }

    product.balancequantity = newBalance;
    this.saveToLocalStorage();
    console.log(
      `Updated balancequantity of product ID ${productId} to ${newBalance}`
    );
  }
}
