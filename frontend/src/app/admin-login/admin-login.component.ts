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

        console.log('Login response:', response); // Add check
        console.log('Login successful, user:', response.data.user); // Add check
    
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          console.log(localStorage.getItem('currentUser'));
          this.authService.currentUser.next(response.data.user);
    
          this.router.navigate(['/admin-compte']).then(success => {
            if (!success) {
              console.error('Navigation to /admin-compte failed.');
            }
          });
        } else {
          console.error('Invalid login response structure:', response);
          this.loginErrorMsg = 'Réponse invalide du serveur.';
        }
    
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loginErrorMsg = error.error?.message || 'Échec de connexion';
        this.isLoading = false;
      }
    });
    
  }
}

