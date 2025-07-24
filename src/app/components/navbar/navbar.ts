import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class Navbar implements OnInit {
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
      console.log('ROle:' + this.userRole);
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
          '/',
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
    sessionStorage.clear();
    // Add any other local/session cleanup if needed

    // Redirect to login
    this.router.navigate(['/login']);
  }
}
