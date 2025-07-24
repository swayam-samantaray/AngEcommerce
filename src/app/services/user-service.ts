import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private roleSource = new BehaviorSubject<string | null>(
    sessionStorage.getItem('role')
  );
  private usernameSource = new BehaviorSubject<string | null>(
    sessionStorage.getItem('username')
  );
  private cartCountSubject = new BehaviorSubject<number>(0);

  role$ = this.roleSource.asObservable();
  username$ = this.usernameSource.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();
  setRole(role: string) {
    this.roleSource.next(role);
    sessionStorage.setItem('role', role);
  }

  getRole(): string | null {
    return this.roleSource.getValue();
  }

  setUsername(username: string) {
    this.usernameSource.next(username);
    sessionStorage.setItem('username', username);
  }

  getUsername(): string | null {
    return this.usernameSource.getValue();
  }

  clearUser() {
    this.setRole('');
    this.setUsername('');
  }

  setUser(username: string, role: string) {
    this.usernameSource.next(username);
    this.roleSource.next(role);
  }

  logout() {
    this.usernameSource.next(null);
    this.roleSource.next(null);
    this.cartCountSubject.next(0);
    // also clear session torage if needed
    sessionStorage.clear();
  }

  updateCartCount(count: number) {
    this.cartCountSubject.next(count);
  }
}
