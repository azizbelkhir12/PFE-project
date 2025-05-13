import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    const newPassword = this.resetForm.value.newPassword;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: res => {
        this.message = '';
        this.error = '';
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Mot de passe réinitialisé avec succès.',
          timer: 3000,
          showConfirmButton: false
        });
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: err => {
        this.message = '';
        this.error = '';
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error.message || 'Une erreur est survenue.',
        });
      }
    });
  }

}
