import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-gestion-beneficiaires',
  templateUrl: './gestion-beneficiaires.component.html',
  styleUrls: ['./gestion-beneficiaires.component.css'],
  standalone: false,
})
export class GestionBeneficiairesComponent {
  modifierBeneficiaire(arg0: any) {
    throw new Error('Method not implemented.');
  }
  supprimerBeneficiaire(arg0: any) {
    throw new Error('Method not implemented.');
  }

  // Liste des bénéficiaires et donateurs (données simulées pour test)
  listeBeneficiaires: any[] = [
    { id: 1, nom: 'Ahmed', prenom: 'Ben Ali', age: 25, telephone: '12345678', gouvernorat: 'Tunis', besoin: 'Aide financière' },
    { id: 2, nom: 'Fatma', prenom: 'Trabelsi', age: 30, telephone: '98765432', gouvernorat: 'Sfax', besoin: 'Soins médicaux' }
  ];

  // Liste des donateurs
  listeDonateurs: any[] = [
    { id: 1, nom: 'Mohamed', prenom: 'Saidi' },
    { id: 2, nom: 'Leila', prenom: 'Jebali' }
  ];

  // Liste des gouvernorats
  gouvernorats: string[] = ['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Gabès'];

  // Variables pour les formulaires et les messages
  totalBeneficiaires: number = this.listeBeneficiaires.length;
  formulaireActif: string = 'beneficiaire';  // Formulaire de création affiché par défaut
  message: string = '';

  // Modèles de données pour les formulaires
  nouveauBeneficiaire: any = { nom: '', prenom: '', age: 0, telephone: '', gouvernorat: '', besoin: '' };
  affectation: any = { idBeneficiaire: 0, idDonateur: 0 };
  beneficiaireSelectionne: number | null = null;

  // Variables pour le filtrage
  filtreNom: string = ''; // Filtre par nom
  filtreAge: number | null = null; // Filtre par âge

  // Changer le formulaire affiché
  afficherFormulaire(formulaire: string) {
    this.formulaireActif = formulaire;
    this.message = ''; // Réinitialise les messages à chaque changement de formulaire
  }

  // Ajouter un nouveau bénéficiaire
  creerBeneficiaire() {
    if (!this.nouveauBeneficiaire.nom || !this.nouveauBeneficiaire.age || !this.nouveauBeneficiaire.telephone) {
      this.message = "⚠️ Veuillez remplir tous les champs requis.";
      return;
    }

    const nouvelId = this.listeBeneficiaires.length + 1;
    const nouveau = { id: nouvelId, ...this.nouveauBeneficiaire };

    this.listeBeneficiaires.push(nouveau);
    this.totalBeneficiaires = this.listeBeneficiaires.length;
    this.message = "✅ Bénéficiaire ajouté avec succès !";

    this.nouveauBeneficiaire = { nom: '', prenom: '', age: 0, telephone: '', gouvernorat: '', besoin: '' };
  }

  // Affecter un bénéficiaire à un donateur
  affecterBeneficiaire() {
    const idBeneficiaire = Number(this.affectation.idBeneficiaire);
    const idDonateur = Number(this.affectation.idDonateur);

    if (!idBeneficiaire || !idDonateur) {
      this.message = "⚠️ Veuillez sélectionner un bénéficiaire et un donateur.";
      return;
    }

    const beneficiaire = this.listeBeneficiaires.find(b => b.id === idBeneficiaire);
    const donateur = this.listeDonateurs.find(d => d.id === idDonateur);

    if (beneficiaire && donateur) {
      this.message = `✅ ${beneficiaire.nom} a été affecté à ${donateur.nom}.`;
    } else {
      this.message = "❌ Erreur : Bénéficiaire ou Donateur introuvable.";
    }

    this.affectation = { idBeneficiaire: 0, idDonateur: 0 };
  }

  // Fonction de filtrage
  filtrerBeneficiaires() {
    return this.listeBeneficiaires.filter(b => {
      const correspondNom = this.filtreNom ? b.nom.toLowerCase().includes(this.filtreNom.toLowerCase()) : true;
      const correspondAge = this.filtreAge ? b.age === this.filtreAge : true;
      return correspondNom && correspondAge;
    });
  }

  // Fonction d'exportation en XLSX
  exportToXLSX() {
    const worksheet = XLSX.utils.json_to_sheet(this.listeBeneficiaires);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bénéficiaires');
    XLSX.writeFile(workbook, 'beneficiaires.xlsx');
  }

  // Fonction d'exportation en PDF
  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Liste des Bénéficiaires', 10, 10);
    this.listeBeneficiaires.forEach((beneficiaire, index) => {
      doc.text(`${beneficiaire.nom} ${beneficiaire.prenom} - Age: ${beneficiaire.age} - Tel: ${beneficiaire.telephone}`, 10, 20 + (index * 10));
    });
    doc.save('beneficiaires.pdf');
  }
}


