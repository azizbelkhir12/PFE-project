// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentUserString = localStorage.getItem('currentUser');
  
    if (currentUserString) {
      try {
        const currentUser = JSON.parse(currentUserString);
        console.log('Parsed currentUser:', currentUser);
        
        if (currentUser.userType === 'admin') {
          console.log('Admin access granted');
          return true;
        }
      } catch (e) {
        console.error('Error parsing currentUser:', e);
      }
    }
  
    this.router.navigate(['/admin-login']);
    return false;
  }
  
}
