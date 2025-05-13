import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service'
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  forgotForm: FormGroup;
  message: string = '';
  error: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userType: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    const { email, userType } = this.forgotForm.value;

    this.authService.forgotPassword(email, userType).subscribe({
      next: res => {
        this.message = '';
        this.error = '';
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Email envoyé avec succès.',
        });
      },
      error: err => {
        this.message = '';
        this.error = err.error.message || 'Erreur.';
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: this.error,
        });
      }
    });
  }

}
