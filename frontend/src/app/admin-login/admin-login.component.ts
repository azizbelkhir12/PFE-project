import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  standalone:false,
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  emailError: string = '';

  constructor(private router: Router) {}

  validateEmail() {
    if (!this.email) {
      this.emailError = "L'email est requis.";
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = emailRegex.test(this.email) ? "" : "Veuillez entrer un email valide.";
  }

  isFormValid(): boolean {
    return this.password.length >= 6 && this.emailError === "";
  }

  onLogin() {
    this.validateEmail();

    if (!this.isFormValid()) {
      console.log("Erreur de saisie :", this.emailError);
      return;
    }

    console.log('Connexion administrateur avec:', this.email, this.password);

    // Stocker l'information de l'admin connecté dans le localStorage
    localStorage.setItem('userRole', 'admin');

    // Rediriger vers la page admin-compte après connexion réussie
    this.router.navigate(['/admin-compte']);
  }
}


