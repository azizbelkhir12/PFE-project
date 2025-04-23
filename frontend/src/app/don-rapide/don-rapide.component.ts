import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../services/payment/payment.service';
import { DonationService } from '../services/donation/donation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-don-rapide',
  standalone: false,
  templateUrl: './don-rapide.component.html',
  styleUrl: './don-rapide.component.css'
})
export class DonRapideComponent {
  paymentForm: FormGroup;
  isLoading = false;
  paymentSuccess = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private donationService: DonationService,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      paymentMethod: ['credit_card', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.checkPaymentReturn();
  }

  checkPaymentReturn() {
    this.route.queryParams.subscribe(params => {
      const paymentId = params['payment_id'];
      if (paymentId) {
        const pendingDonationStr = sessionStorage.getItem('pendingDonation');
        if (pendingDonationStr) {
          const pendingDonation = JSON.parse(pendingDonationStr);
          if (pendingDonation.paymentMethod === 'credit_card') {
            this.handlePaymentCallback(paymentId);
          } else {
            sessionStorage.removeItem('pendingDonation');
          }
        }
      }
    });
  }

  onSubmit() {
    if (this.paymentForm.invalid) return;

    this.isLoading = true;
    const formData = this.paymentForm.value;

    if (formData.paymentMethod !== 'credit_card') {
      sessionStorage.removeItem('pendingDonation');
      this.createDonation(formData);
    } else {
      sessionStorage.setItem('pendingDonation', JSON.stringify(formData));
      this.initiatePaymentFlow(formData);
    }
  }

  initiatePaymentFlow(formData: any) {
    this.paymentService.makePayment(formData).subscribe({
      next: (res: any) => {
        if (res?.result?.link) {
          window.location.href = res.result.link;
        } else {
          Swal.fire('Error', 'Payment link not received', 'error');
          this.isLoading = false;
        }
      },
      error: () => {
        Swal.fire('Error', 'Payment initialization failed', 'error');
        this.isLoading = false;
      }
    });
  }

  handlePaymentCallback(paymentId: string) {
    this.isLoading = true;
    const pendingDonation = JSON.parse(sessionStorage.getItem('pendingDonation') || '{}');
  
    if (!pendingDonation.amount) {
      Swal.fire('Error', 'Donation information not found', 'error');
      this.isLoading = false;
      return;
    }
  
    this.paymentService.verifyPayment(paymentId, pendingDonation).subscribe({
      next: (verification: any) => {
        if (verification.success) {
          const donationData = {
            ...pendingDonation,
            paymentId: paymentId,
            paymentDetails: verification.paymentDetails,
            status: 'completed'
          };
          this.createDonation(donationData);
        } else {
          this.handlePaymentError('Payment verification failed');
        }
      },
      error: () => {
        this.handlePaymentError('Payment verification error');
      }
    });
  }
  
  private createDonation(donationData: any) {
    this.donationService.createDonation(donationData).subscribe({
      next: () => {
        Swal.fire('Success', 'Thank you for your donation!', 'success');
        this.paymentSuccess = true;
        sessionStorage.removeItem('pendingDonation');
        this.isLoading = false;
      },
      error: (err) => {
        this.handlePaymentError(err.message || 'Error saving donation');
      }
    });
  }
  
  private handlePaymentError(errorMessage: string) {
    Swal.fire('Error', errorMessage, 'error');
    this.isLoading = false;
    sessionStorage.removeItem('pendingDonation');
    console.error(errorMessage);
  }
}
