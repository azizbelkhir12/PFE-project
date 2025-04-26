import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-beneficiaire-compte',
  templateUrl: './beneficiaire-compte.component.html',
  styleUrls: ['./beneficiaire-compte.component.css'],
  standalone: false
})
export class BeneficiaireCompteComponent implements OnInit {
seDeconnecter() {
throw new Error('Method not implemented.');
}
  sectionActive: string = 'profil'; // Section affichée par défaut
  utilisateur: any;
  documentsComplete: any;

  ngOnInit() {
    // Données fictives pour les tests
    this.utilisateur = {
      nom: 'Ghazouani',
      prenom: 'Amal',
      email: 'amal@example.com',
      gouvernorat: 'Ariana',
      adresse: 'Rue des Jasmins'
    };

    this.documentsComplete = {
      photoProfil: true,
      photoMaison: true,
      bulletin: false
    };

    // Ici, on s'assure que la section "profil" est affichée par défaut
    this.afficherSection('profil');
  }

  afficherSection(section: string): void {
    this.sectionActive = section;
  }

  verifierDocumentsComplets(): boolean {
    return Object.values(this.documentsComplete).every((document) => document === true);
  }

  modifierEmail(): void {
    this.utilisateur.email = 'nouveau-email@example.com';
    console.log('Email modifié:', this.utilisateur.email);
  }

  modifierNom(): void {
    this.utilisateur.nom = 'NouveauNom';
    console.log('Nom modifié:', this.utilisateur.nom);
  }

  afficherMessageDocuments(): string {
    if (this.verifierDocumentsComplets()) {
      return 'Tous les documents sont complets.';
    } else {
      return 'Il manque des documents à soumettre.';
    }
  }
}
