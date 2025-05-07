import { Component } from '@angular/core';

@Component({
  selector: 'app-historique-paiement',
  standalone: false,
  templateUrl: './historique-paiement.component.html',
  styleUrl: './historique-paiement.component.css'
})
export class HistoriquePaiementComponent {
  filtreStatut: string = '';
  recherche: string = '';
  paiements: ({ date: string; montant: number; moyen: string; statut: string; reçu: string; re: string; recu: undefined; } | { date: string; montant: number; moyen: string; statut: string; re: string; recu: undefined; reçu?: undefined; })[] = [];

  ngOnInit(): void {
    // Exemple de données
    this.paiements = [
      {
        date: '2025-04-01', montant: 100, moyen: 'Carte bancaire', statut: 'réussi', reçu: 'recu_01.pdf',
        re: '',
        recu: undefined
      },
      {
        date: '2025-03-15', montant: 50, moyen: 'Virement', statut: 'en attente',
        re: '',
        recu: undefined
      },
      {
        date: '2025-02-10', montant: 80, moyen: 'Espèces', statut: 'échoué',
        re: '',
        recu: undefined
      },
    ];
  }

  get paiementsFiltres() {
    return this.paiements.filter(p =>
      (this.filtreStatut === '' || p.statut === this.filtreStatut) &&
      (this.recherche === '' || p.moyen.toLowerCase().includes(this.recherche.toLowerCase()))
    );
  }
}


