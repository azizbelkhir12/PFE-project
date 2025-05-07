import { Component } from '@angular/core';
import { AbonnementService } from '../services/abonnement/abonnement.service';
import { AuthService } from '../services/auth/auth.service';

interface Paiement {
  recu: any;
  re: string;
  date: string;
  montant: number;
  moyen: string;
  statut: 'réussi' | 'en attente' | 'échoué';
  reçu?: string; // URL ou nom du fichier
}

@Component({
  selector: 'app-historique-paiements-benevoles',
  standalone: false,
  templateUrl: './historique-paiements.component.html',
  styleUrl: './historique-paiements.component.css'
})
export class HistoriquePaiementsComponent {
  paiements: Paiement[] = [];
  filtreStatut: string = '';
  recherche: string = '';

  constructor(
    private abonnementService: AbonnementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const volunteerId = this.authService.getCurrentUserId();
    if (volunteerId) {
      this.abonnementService.getAbonnementByVolunteer(volunteerId).subscribe({
        next: (response) => {
          // Assuming response.abonnements is an array of abonnements
          // Map abonnements to paiements (your UI model)
          this.paiements = response.abonnements.map((abonnement: any) => ({
            recu: abonnement._id,
            re: `${abonnement.name} ${abonnement.lastname}`,
            date: abonnement.paymentDate,
            montant: abonnement.amount,
            moyen: abonnement.paymentMethod,
            statut: abonnement.status === 'completed' ? 'réussi' : abonnement.status === 'pending' ? 'en attente' : 'échoué',
            reçu: abonnement.receiptUrl || '' // if you have a receipt URL field
          }));
        },
        error: (err) => {
          console.error('Error fetching abonnements:', err);
        }
      });
    } else {
      console.error('Volunteer ID is null');
    }
  }
    
  

  get paiementsFiltres() {
    return this.paiements.filter(p =>
      (this.filtreStatut === '' || p.statut === this.filtreStatut) &&
      (this.recherche === '' || p.moyen.toLowerCase().includes(this.recherche.toLowerCase()))
    );
  }
}
