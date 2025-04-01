import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  standalone:false,
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  loginData = { 
    email: '', 
    password: '',
    userType: 'admin'
  };
  loginErrorMsg = ' veuillez remplir les champs';
  loginSuccessMsg = 'Connexion réussie';
  isLoading = false;

  constructor(private router: Router, private authService : AuthService ) {}


  submitLogin() {
    this.isLoading = true;
    this.loginErrorMsg = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/admin-compte']);
      },
      error: (error) => {
        this.loginErrorMsg = error.error?.message || 'Admin login failed';
        this.isLoading = false;
      }
    })
  }

}

