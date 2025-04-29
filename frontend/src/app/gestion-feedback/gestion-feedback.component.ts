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

  supprimerFeedback(id: string): void {
    if (!id) {
      console.error('ID is undefined or null');
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erreur',
        text: 'ID du Feedback manquant',
        showConfirmButton: true
      });
      return;
    }
  
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContactForm(id).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé !',
              'Le Feedback a été supprimé.',
              'success'
            );
            this.chargerFeedbacks();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du Feedback:', error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de supprimer le Feedback: ' + error.message,
              showConfirmButton: true
            });
          }
        });
      }
    });
  }

}