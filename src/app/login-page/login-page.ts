import { Component } from '@angular/core';
import { AuthService } from '../auth-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  username = '';
  password = '';
  role = '';
  isLoggedIn = false;
  private loginSub: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginSub = this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  onLogin(): void {
    const success = this.authService.login(this.username, this.password);
    if (!success) {
      alert('Invalid credentials');
    } else {
      this.router.navigate(['/home']);
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}
