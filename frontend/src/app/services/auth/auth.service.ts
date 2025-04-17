import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private currentUserSubject: BehaviorSubject<any>;
  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private router: Router) {
    // Safely parse localStorage data
    const storedUser = localStorage.getItem('currentUser');
    try {
      this.currentUserSubject = new BehaviorSubject<any>(
        storedUser ? JSON.parse(storedUser) : null
      );
    } catch (e) {
      console.error('Error parsing user data:', e);
      localStorage.removeItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }
    
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn() {
    return !!this.currentUserValue;
  }

  public get token() {
    return localStorage.getItem('token');
  }

  // Register a new donor
  register(donorData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/donors/register`, donorData);
  }

  // Login with credentials
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token && response.data.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify({userType : response.data.userType})); // ✅ Store full user object
          this.currentUserSubject.next(response.data.user);
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
  
  // Get authenticated user profile
  getProfile(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(`${this.apiUrl}/auth/me`, { headers });
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Check if user has a specific role
  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  // Check if user is admin
  get isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Auto login if token exists
  autoLogin(): void {
    const token = this.token;
    if (token) {
      this.getProfile().subscribe({
        next: (user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }
}