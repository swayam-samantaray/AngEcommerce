import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './services/user-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService) {}

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  login(username: string, password: string): boolean {
    // Dummy validation — replace with real API call
    if (
      (username === 'admin' && password === 'admin') ||
      (username === 'customer' && password === '123') ||
      (username === 'stockist' && password === '123')
    ) {
      if (username === 'admin') {
        this.userService.setRole('admin');
      } else if (username === 'stockist') {
        this.userService.setRole('stockist');
      } else {
        this.userService.setRole('customer');
      }

      this.userService.setUsername(username);

      this.isLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    sessionStorage.clear();
  }
}
