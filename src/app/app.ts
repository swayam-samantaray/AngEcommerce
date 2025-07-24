import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from './services/cart';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user-service';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterModule, FormsModule, CommonModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  username: string | null = null;
  showNavbar = true;
  itemCount = 0;
  protected title = 'ecommerce';
  userRole: string | null = null;
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private router: Router
  ) {
    this.userService.role$.subscribe((role) => {
      this.userRole = role;
    });

    this.userService.username$.subscribe((username) => {
      this.username = username;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = ![
          '/login',
          '/signup',
          '/forgot-password',
          '',
        ].includes(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    // this.updateCount();
    this.cartService.itemCount$.subscribe((count) => {
      this.itemCount = count;
    });
  }

  updateCount() {
    this.itemCount = this.cartService
      .getItems()
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  onLogout(): void {
    // Clear user data
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Add any other local/session cleanup if needed

    // Redirect to login
    this.router.navigate(['/login']);
  }
}
