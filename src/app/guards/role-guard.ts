import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user-service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRoles: string[] = ['admin', 'customer', 'stockist'];

    return this.userService.role$.pipe(
      map((userRole) => {
        if (userRole && expectedRoles.includes(userRole)) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
