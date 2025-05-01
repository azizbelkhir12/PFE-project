import { Component } from '@angular/core';


@Component({
  selector: 'app-benevole-compte',
  standalone: false,
  templateUrl: './benevole-compte.component.html',
  styleUrl: './benevole-compte.component.css'
})
export class BenevoleCompteComponent {
  activeSection: string = 'profil'; // Section par défaut

  // Données statiques pour le bénévole
  benevole = {
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '0123456789',
    adresse: {
      rue: '123 Rue de la Solidarité',
      ville: 'Paris',
      codePostal: '75000'
    },
    abonnementActif: false
  };

  // Historique de paiements simulé
  historiquePaiements = [
    { date: '2023-01-15', montant: 30, methode: 'Carte', statut: 'Réussi' },
    { date: '2022-01-10', montant: 30, methode: 'PayPal', statut: 'Réussi' }
  ];

  // Messages de chat simulés
  messages = [
    { expediteur: 'admin', contenu: 'Bonjour, comment puis-je vous aider ?', date: '2023-11-20T10:30' },
    { expediteur: 'benevole', contenu: 'Je souhaite modifier mon adresse.', date: '2023-11-20T10:32' }
  ];

  constructor() {} // Pas besoin de BenevoleService en mode statique

  // Basculer entre les sections
  showSection(section: string) {
    this.activeSection = section;
  }

  // Simuler la mise à jour du profil
  updateProfil() {
    alert('Profil mis à jour (simulation) !');
  }

  // Simuler un paiement
  payerAbonnement() {
    this.benevole.abonnementActif = true;
    this.historiquePaiements.unshift({
      date: new Date().toISOString().split('T')[0],
      montant: 30,
      methode: 'Carte',
      statut: 'Réussi'
    });
    alert('Paiement simulé ! Abonnement activé.');
  }
}



