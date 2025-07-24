import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductList } from './pages/product-list/product-list';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { OrderSuccess } from './pages/order-success/order-success';
import { LoginPage } from './login-page/login-page';
import { RoleGuard } from './guards/role-guard';
import { Addstock } from './addstock/addstock';
import { Stockdetails } from './stockdetails/stockdetails';

export const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'login', component: LoginPage },
  {
    path: 'products',
    component: ProductList,
    canActivate: [RoleGuard],
  },
  {
    path: 'home',
    component: Home,
    canActivate: [RoleGuard],
  },
  {
    path: 'product/:id',
    component: ProductDetail,
    canActivate: [RoleGuard],
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [RoleGuard],
  },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [RoleGuard],
  },
  {
    path: 'order-success',
    component: OrderSuccess,
    canActivate: [RoleGuard],
  },
  {
    path: 'addstock',
    component: Addstock,
    canActivate: [RoleGuard],
  },
  {
    path: 'stockdetails',
    component: Stockdetails,
    canActivate: [RoleGuard],
  },
  { path: 'addstock/:id', component: Addstock },
];
