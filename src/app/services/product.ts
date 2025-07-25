import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from '../models/product.model';

const STORAGE_KEY = 'products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: ProductModel[] = [];
  private productsSubject = new BehaviorSubject<ProductModel[]>([]);
  public products$ = this.productsSubject.asObservable();

  private initialized = false;

  constructor(private http: HttpClient) {}

  private loadInitialData(): Promise<void> {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.products = JSON.parse(stored);
        this.productsSubject.next(this.products);
        this.initialized = true;
        resolve();
      } else {
        this.http
          .get<ProductModel[]>('assets/products.json')
          .subscribe((data) => {
            this.products = data;
            this.saveToLocalStorage();
            this.productsSubject.next(this.products);
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

  getProductById(id: number): ProductModel | undefined {
    return this.products.find((p) => p.id === id);
  }

  async addProduct(product: ProductModel): Promise<void> {
    if (!this.initialized) await this.loadInitialData();
    product.id = this.getNextId();
    this.products.push(product);
    this.saveToLocalStorage();
    this.productsSubject.next(this.products);
  }

  async deleteProduct(id: number): Promise<void> {
    if (!this.initialized) await this.loadInitialData();
    this.products = this.products.filter((p) => p.id !== id);
    this.saveToLocalStorage();
    this.productsSubject.next(this.products);
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
      this.productsSubject.next(this.products);
      console.log(`Product with ID ${updated.id} updated successfully.`);
    } else {
      console.warn(`Product with ID ${updated.id} not found.`);
    }
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
    this.productsSubject.next(this.products);
    console.log(
      `Updated balancequantity of product ID ${productId} to ${newBalance}`
    );
  }

  async updateMultipleProductBalances(productMap: {
    [productId: number]: number;
  }): Promise<void> {
    if (!this.initialized) await this.loadInitialData();

    let updated = false;
    for (const [idStr, newQty] of Object.entries(productMap)) {
      const id = Number(idStr);
      const product = this.products.find((p) => p.id === id);
      if (product) {
        product.balancequantity = newQty;
        updated = true;
      }
    }

    if (updated) {
      this.saveToLocalStorage();
      this.productsSubject.next(this.products);
    }
  }

  getNextId(): number {
    return this.products.length > 0
      ? Math.max(...this.products.map((p) => p.id)) + 1
      : 1;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products));
  }

  // ✅ NEW METHOD: Deducts quantity from stock based on cart items
  async deductStockFromCartItems(
    cartItems: { product: ProductModel; quantity: number }[]
  ): Promise<void> {
    if (!this.initialized) await this.loadInitialData();

    let updated = false;

    for (const item of cartItems) {
      const product = this.products.find((p) => p.id === item.product.id);
      if (product && product.balancequantity >= item.quantity) {
        product.balancequantity -= item.quantity;
        updated = true;
      } else {
        console.warn(
          `Cannot deduct stock for product ID ${item.product.id}. Insufficient stock or not found.`
        );
      }
    }

    if (updated) {
      this.saveToLocalStorage();
      this.productsSubject.next(this.products);
      console.log('Product quantities updated after checkout.');
    }
  }
}
