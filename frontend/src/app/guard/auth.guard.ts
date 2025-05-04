// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (token && !this.authService.isTokenExpired()) {
      return true;
    } else {
      // redirect depending on the URL
      const url = state.url;
      if (url.includes('admin')) {
        this.router.navigate(['/admin-login']);
      } else {
        this.router.navigate(['/']);
      }
      return false;
    }
  }
}
