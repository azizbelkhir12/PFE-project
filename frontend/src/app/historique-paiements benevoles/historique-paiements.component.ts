import { Component } from '@angular/core';
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
export class HistoriquePaiementsComponent {paiements: Paiement[] = [];
  filtreStatut: string = '';
  recherche: string = '';

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
