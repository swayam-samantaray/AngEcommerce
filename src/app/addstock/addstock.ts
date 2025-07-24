import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product';
import { ProductModel } from '../models/product.model';

@Component({
  selector: 'app-addstock',
  imports: [CommonModule, FormsModule],
  templateUrl: './addstock.html',
  styleUrl: './addstock.scss',
})
export class Addstock implements OnInit {
  products: ProductModel[] = [];
  newProduct: Partial<ProductModel> = {};
  editMode = false;
  productIdToEdit?: number;
  // Define your category options
  categoryOptions: string[] = [
    'Electronics',
    'Mobile',
    'Books',
    'Clothing',
    'Food',
    'Furniture',
  ];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  isFormValid(): boolean {
    return !!(
      this.newProduct.name &&
      this.newProduct.category &&
      this.newProduct.price
    );
  }

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editMode = true;
      this.productIdToEdit = +idParam;
      const product = await this.productService.getProductById(
        this.productIdToEdit
      );
      if (product) {
        this.newProduct = { ...product };
      } else {
        alert('Product not found.');
      }
    }
  }

  async addOrUpdateProduct(): Promise<void> {
    if (
      !this.newProduct.name ||
      !this.newProduct.category ||
      !this.newProduct.price
    ) {
      alert('Please fill all required fields.');
      return;
    }

    if (this.editMode && this.productIdToEdit != null) {
      // Update existing product
      const updatedProduct: ProductModel = {
        id: this.productIdToEdit,
        name: this.newProduct.name!,
        category: this.newProduct.category!,
        price: +this.newProduct.price!,
        imageUrl: this.newProduct.imageUrl || '',
        description: this.newProduct.description || '',
        specification: this.newProduct.specification || '',
        discount_price: +this.newProduct.discount_price!,
        quantity: +this.newProduct.quantity!,
        balancequantity: +this.newProduct.balancequantity!,
      };

      await this.productService.updateProduct(updatedProduct);
      alert('Product updated successfully.');
    } else {
      // Add new product
      const newEntry: ProductModel = {
        id: this.productService.getNextId(),
        name: this.newProduct.name!,
        category: this.newProduct.category!,
        price: +this.newProduct.price!,
        imageUrl: this.newProduct.imageUrl || '',
        description: this.newProduct.description || '',
        specification: this.newProduct.specification || '',
        discount_price: +this.newProduct.discount_price!,
        quantity: +this.newProduct.quantity!,
        balancequantity: +this.newProduct.balancequantity!,
      };

      await this.productService.addProduct(newEntry);
      alert('Product added successfully.');
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Only JPG and PNG images are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
