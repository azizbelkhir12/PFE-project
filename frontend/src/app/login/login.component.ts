import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone:false,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  role: string = '';
  donateurType: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';

  // ✅ Ajout des erreurs pour éviter l'erreur de compilation
  emailError: string = '';
  phoneError: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  validateEmail() {
    if (this.role !== 'beneficiaire') {
      if (!this.email.trim()) {
        this.emailError = "L'email est requis.";
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = emailRegex.test(this.email) ? "" : "Veuillez entrer un email valide.";
    } else {
      this.emailError = "";
    }
  }

  validatePhone() {
    if (this.role === 'beneficiaire') {
      if (!this.phone.trim()) {
        this.phoneError = "Le téléphone est requis.";
        return;
      }
      const phoneRegex = /^[0-9]{8}$/;
      this.phoneError = phoneRegex.test(this.phone) ? "" : "Le numéro de téléphone doit contenir 8 chiffres.";
    } else {
      this.phoneError = "";
    }
  }

  isFormValid(): boolean {
    this.errorMessage = "";

    if (!this.role) {
      this.errorMessage = "Veuillez sélectionner un rôle.";
      return false;
    }

    if (this.role === 'beneficiaire') {
      if (this.phoneError) {
        this.errorMessage = this.phoneError;
        return false;
      }
    } else {
      if (this.emailError) {
        this.errorMessage = this.emailError;
        return false;
      }
    }

    if (this.password.length < 6) {
      this.errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      return false;
    }

    if (this.role === 'donateur' && !this.donateurType) {
      this.errorMessage = "Veuillez choisir un type de donateur.";
      return false;
    }

    return true;
  }

  onLogin() {
    if (!this.isFormValid()) {
      return;
    }

    // ✅ Stocker le rôle et rediriger vers la bonne page
    localStorage.setItem('userRole', this.role);
    switch (this.role) {
      case 'donateur':
        localStorage.setItem('donateurType', this.donateurType);
        if (this.donateurType === 'parrain') {
          this.router.navigate(['/donateur-parrain-compte']);
        } else {
          this.router.navigate(['/donateur-standard-compte']);
        }
        break;

      case 'beneficiaire':
        this.router.navigate(['/beneficiaire-compte']);
        break;

      case 'benevole':
        this.router.navigate(['/benevole-compte']);
        break;

      default:
        this.errorMessage = "Erreur lors de la connexion.";
    }
  }
}






