import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; 
  
  constructor(private http: HttpClient, private router: Router) { }

  // Register a new donor
  register(donorData: any): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/donors/register`, donorData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }


   // Logout a donor (if needed)
   logout(): void {
    localStorage.removeItem('token'); // Clear the token from local storage
    this.router.navigate(['/login']); // Redirect to the login page
  }

}
