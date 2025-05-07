import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbonnementService } from '../services/abonnement/abonnement.service';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abonnement-benevole',
  standalone: false,
  templateUrl: './abonnement-benevole.component.html',
  styleUrl: './abonnement-benevole.component.css'
})
export class AbonnementBenevoleComponent {

  paymentForm: FormGroup;
  isLoading = false;
  paymentSuccess = false;
  message: string = '';
  showPaymentType = false;

  private bankInfo = {
    bankName: 'Your Bank Name',
    accountName: 'Your Organization Name',
    accountNumber: 'XXXX XXXX XXXX XXXX',
    iban: 'TNXX XXXX XXXX XXXX XXXX XXXX',
    rib: 'XXXX XXXX XXXX XXXX XXXX XX',
    swiftCode: 'XXXXXX'
  };

  private cashPaymentInfo = {
    address: '63 rue Iran 1002, Tunis, Tunisia',
    phoneNumber: '+216 28 391 000',
    workingHours: 'Lundi - Vendredi: 9:00 - 17:00'
  };

  constructor(
    private fb: FormBuilder,
    private abonnementService: AbonnementService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      amount: ['20000', [Validators.required, Validators.min(1)]],
      paymentMethod: ['credit_card', Validators.required],
      paymentType: ['local', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]]
    });

    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.showPaymentType = method === 'credit_card';
      if (!this.showPaymentType) {
        this.paymentForm.patchValue({ paymentType: 'local' });
      }
      if (method === 'bank_transfer') {
        this.showBankInformation();
      } else if (method === 'cash') {
        this.showCashPaymentInformation();
      }
    });
  }

  ngOnInit(): void {
    this.checkPaymentReturn();
  }

  showBankInformation() {
    Swal.fire({
      title: 'Informations de Virement Bancaire',
      html: `
        <div style="text-align: left;">
          <p><strong>Nom de la Banque:</strong> ${this.bankInfo.bankName}</p>
          <p><strong>Nom du Compte:</strong> ${this.bankInfo.accountName}</p>
          <p><strong>Numéro de Compte:</strong> ${this.bankInfo.accountNumber}</p>
          <p><strong>IBAN:</strong> ${this.bankInfo.iban}</p>
          <p><strong>RIB:</strong> ${this.bankInfo.rib}</p>
          <p><strong>Code SWIFT:</strong> ${this.bankInfo.swiftCode}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Je Comprends',
      footer: 'Veuillez utiliser votre nom comme référence de paiement'
    });
  }

  showCashPaymentInformation() {
    Swal.fire({
      title: 'Informations de Paiement en Espèces',
      html: `
        <div style="text-align: left;">
          <p><strong>Adresse:</strong> ${this.cashPaymentInfo.address}</p>
          <p><strong>Numéro de Téléphone:</strong> ${this.cashPaymentInfo.phoneNumber}</p>
          <p><strong>Heures de Travail:</strong></p>
          <p style="white-space: pre-line;">${this.cashPaymentInfo.workingHours}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Je Comprends',
      footer: 'Veuillez apporter le montant exact si possible'
    });
  }

  checkPaymentReturn() {
    this.route.queryParams.subscribe(params => {
      const paymentId = params['payment_id'];
      if (paymentId) {
        const pendingAbonnement = this.getPendingAbonnement();
        if (pendingAbonnement?.paymentMethod === 'credit_card') {
          this.handlePaymentCallback(paymentId);
        } else {
          sessionStorage.removeItem('pendingAbonnement');
        }
      }
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) return;

    this.isLoading = true;
    const formData = this.paymentForm.value;

    if (formData.paymentMethod === 'bank_transfer' || formData.paymentMethod === 'cash') {
      this.handleBankOrCashPayment(formData);
    } else {
      this.storePendingAbonnement(formData);
      this.initiatePaymentFlow(formData);
    }
  }

  private getPendingAbonnement(): any {
    const pendingAbonnementStr = sessionStorage.getItem('pendingAbonnement');
    return pendingAbonnementStr ? JSON.parse(pendingAbonnementStr) : null;
  }

  private storePendingAbonnement(formData: any): void {
    sessionStorage.setItem('pendingAbonnement', JSON.stringify(formData));
  }

  private handleBankOrCashPayment(formData: any): void {
    Swal.fire({
      title: 'Rappel Important',
      html: formData.paymentMethod === 'bank_transfer'
        ? 'Veuillez inclure votre nom dans la référence de virement bancaire.'
        : 'Veuillez apporter le montant exact à notre bureau pendant les heures de travail.',
      icon: 'warning',
      confirmButtonText: 'Je Comprends',
      showCancelButton: true,
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.createAbonnement(formData);
      } else {
        this.isLoading = false;
      }
    });
  }

  initiatePaymentFlow(formData: any): void {
    this.abonnementService.initiatePayment(formData).subscribe({
      next: (res: any) => {
        const paymentUrl = res?.result?.link || res?.payment_url;
        
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          console.error('Payment URL not found in:', res);
          this.showPaymentError('Lien de paiement non reçu. Structure de réponse inattendue.');
        }
      },
      error: (error) => {
        console.error('Payment initiation failed:', error);
        this.showPaymentError(error.error?.message || 'Échec de l\'initialisation du paiement');
      }
    });
  }

  private handlePaymentCallback(paymentId: string): void {
    this.isLoading = true;
    const pendingAbonnement = this.getPendingAbonnement();

    if (!pendingAbonnement?.amount) {
      this.showPaymentError('Informations d\'abonnement non trouvées');
      return;
    }

    this.abonnementService.verifyPayment(paymentId).subscribe({
      next: (verification: any) => {
        if (verification.success && verification.paymentDetails?.status === "SUCCESS") {
          this.createAbonnement({
            ...pendingAbonnement,
            paymentId: paymentId,
            amount: verification.paymentDetails.amount,
            status: 'completed'
          });
        } else {
          this.showPaymentError('Échec de la vérification du paiement');
        }
      },
      error: (error) => {
        this.showPaymentError(error.error?.message || 'Erreur de vérification du paiement');
      }
    });
  }

  private createAbonnement(abonnementData: any) {
    // Get current volunteer ID
    const volunteerId = this.authService.getCurrentUserId();
    
    // Split guest name into first and last name
    const nameParts = abonnementData.guestName?.trim().split(/\s+/) || [];
    const name = nameParts[0] || '';
    const lastname = nameParts.slice(1).join(' ') || '';

    // Prepare complete data object
    const completeAbonnementData = {
      volunteer: volunteerId,
      name: name,
      lastname: lastname,
      paymentMethod: abonnementData.paymentMethod,
      amount: 20000,
      status: 'completed', // Default status for successful payments
      paymentType: abonnementData.paymentType || 'local' // default to 'local'
    };

    this.abonnementService.createAbonnement(completeAbonnementData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès',
          text: 'Votre abonnement a été enregistré avec succès!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.paymentSuccess = true;
        sessionStorage.removeItem('pendingAbonnement');
        this.isLoading = false;
        
        // Optional: Redirect or perform other success actions
        // this.router.navigate(['/success-page']);
      },
      error: (err) => {
        console.error('Abonnement creation error:', err);
        
        let errorMessage = 'Erreur lors de l\'enregistrement de l\'abonnement';
        if (err.error?.message) {
          errorMessage += `: ${err.error.message}`;
        } else if (err.message) {
          errorMessage += `: ${err.message}`;
        }

        Swal.fire({
          title: 'Erreur',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        
        this.isLoading = false;
        sessionStorage.removeItem('pendingAbonnement');
      }
    });
  }
  private handlePaymentSuccess(): void {
    Swal.fire('Succès', 'Votre abonnement a été enregistré avec succès!', 'success');
    this.paymentSuccess = true;
    sessionStorage.removeItem('pendingAbonnement');
    this.isLoading = false;
  }

  private showPaymentError(message: string): void {
    Swal.fire('Erreur', message, 'error');
    this.isLoading = false;
    sessionStorage.removeItem('pendingAbonnement');
    console.error(message);
  }
}