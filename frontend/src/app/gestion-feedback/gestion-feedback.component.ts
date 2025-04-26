import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-feedback',
  standalone: false,
  templateUrl: './gestion-feedback.component.html',
  styleUrl: './gestion-feedback.component.css'
})
export class GestionFeedbackComponent implements OnInit {
supprimerFeedback(arg0: any) {
throw new Error('Method not implemented.');
}

  totalFeedbacks: number = 0;
  feedbacks: any[] = [];
i: any;

  constructor(private contactService : ContactService) {}

  ngOnInit(): void {
    
    this.feedbacks = [];
    this.chargerFeedbacks();
    this.totalFeedbacks = this.feedbacks.length;
  }

  chargerFeedbacks(): void {
    this.contactService.getContactForm().subscribe({
      next: (response: any[]) => {
        this.feedbacks = response;
        this.totalFeedbacks = this.feedbacks.length;
        
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des Feedbacks:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer les Feedbacks',
          showConfirmButton: true
        });
      }
    });
  }
  
  }

