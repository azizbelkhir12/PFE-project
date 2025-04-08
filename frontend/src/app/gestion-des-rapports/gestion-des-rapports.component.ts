import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';  // Importation de jsPDF

@Component({
  selector: 'app-gestion-des-rapports',
  templateUrl: './gestion-des-rapports.component.html',
  standalone: false,
  styleUrls: ['./gestion-des-rapports.component.css']
})
export class GestionDesRapportsComponent {
  afficherFormulaire = true;

  rapport = {
    titre: '',
    type: '',
    fichier: null as File | null,
    nomFichier: ''
  };

  message: string = '';
  typeMessage: 'success' | 'error' = 'success';

  rapports = [
    {
      titre: 'Rapport Janvier',
      type: 'financier',
      date: '2024-01-10',
      publie: true,
      nomFichier: 'rapport-janvier.pdf',
      fichier: new File(["Rapport contenu"], 'rapport-janvier.pdf', { type: 'application/pdf' }) // Exemple de fichier
    },
    {
      titre: 'Rapport Février',
      type: 'litteraire',
      date: '2024-02-14',
      publie: false,
      nomFichier: 'rapport-fevrier.pdf',
      fichier: new File(["Rapport contenu"], 'rapport-fevrier.pdf', { type: 'application/pdf' })
    },
    {
      titre: 'Analyse Q1',
      type: 'financier',
      date: '2024-03-21',
      publie: true,
      nomFichier: 'analyse-q1.pdf',
      fichier: new File(["Rapport contenu"], 'analyse-q1.pdf', { type: 'application/pdf' })
    },
    {
      titre: 'Rapport Mars',
      type: 'litteraire',
      date: '2024-03-29',
      publie: false,
      nomFichier: 'rapport-mars.pdf',
      fichier: new File(["Rapport contenu"], 'rapport-mars.pdf', { type: 'application/pdf' })
    }
  ];

  rechercheTitre = '';
  rechercheDate = '';

  // Gère la sélection du fichier
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.rapport.fichier = file;
      this.rapport.nomFichier = file.name;
    }
  }

  // Ajout d’un nouveau rapport avec vérification
  ajouterRapport() {
    if (!this.rapport.titre || !this.rapport.type || !this.rapport.fichier) {
      this.afficherMessage('❌ Veuillez remplir tous les champs', 'error');
      return;
    }

    const nouveauRapport = {
      titre: this.rapport.titre,
      type: this.rapport.type,
      date: new Date().toISOString().split('T')[0],
      publie: false,
      nomFichier: this.rapport.nomFichier,
      fichier: this.rapport.fichier
    };

    this.rapports.push(nouveauRapport);
    this.rapport = { titre: '', type: '', fichier: null, nomFichier: '' };

    this.afficherMessage('✅ Rapport ajouté avec succès !', 'success');
  }

  // Supprime un rapport
  supprimerRapport(r: any) {
    this.rapports = this.rapports.filter(item => item !== r);
    this.afficherMessage('🗑️ Rapport supprimé', 'success');
  }

  // Publie un rapport
  publierRapport(r: any) {
    r.publie = true;
    this.afficherMessage('📢 Rapport publié avec succès !', 'success');
  }

  // Filtre les rapports selon la recherche
  getRapportsFiltres() {
    return this.rapports.filter(r => {
      const matchTitre = this.rechercheTitre
        ? r.titre.toLowerCase().includes(this.rechercheTitre.toLowerCase())
        : true;
      const matchDate = this.rechercheDate ? r.date === this.rechercheDate : true;
      return matchTitre && matchDate;
    });
  }

  // Affiche un message temporaire
  afficherMessage(texte: string, type: 'success' | 'error') {
    this.message = texte;
    this.typeMessage = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  // Fonction modifiée pour télécharger un fichier PDF
  telechargerRapport(r: any) {
    const lien = document.createElement('a');

    // Si un fichier est bien sélectionné et que c'est un fichier PDF
    if (r.fichier && r.fichier.name.endsWith('.pdf')) {
      const fileURL = URL.createObjectURL(r.fichier); // Crée une URL pour le fichier téléchargé
      lien.href = fileURL;
      lien.download = r.nomFichier;  // Utilise le nom du fichier pour le téléchargement
      lien.click();  // Lance le téléchargement
    } else {
      this.afficherMessage(' Ce fichier ne peut pas être exporté (non-PDF).', 'error');
    }
  }

  // Statistiques dynamiques
  get totalRapports() {
    return this.rapports.length;
  }

  get rapportsPublies() {
    return this.rapports.filter(r => r.publie).length;
  }

  get rapportsFinanciers() {
    return this.rapports.filter(r => r.type === 'financier').length;
  }

  get rapportsLitteraires() {
    return this.rapports.filter(r => r.type === 'litteraire').length;
  }
}
