import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { NgForm } from '@angular/forms';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-gestion-beneficiaires',
  templateUrl: './gestion-beneficiaires.component.html',
  styleUrls: ['./gestion-beneficiaires.component.css'],
  standalone: false,
})
export class GestionBeneficiairesComponent {

  nouveauBeneficiaire = {
    _id: '', // Add the _id property
    name: '',
    lastname: '',
    address: '',
    email: '',
    password: '',
    phoneNumber: '',
    Age: 0,
    gouvernorat: '',
    children: [
      { name: '', age: null } // 👈 Add at least one by default
    ]
  };

  constructor(private beneficiaryService: BeneficiaryService) {}

  ngOnInit(): void {
    this.getBeneficiaires();
  }
  
  beneficiaries: any[] = []; // Declare the beneficiaries property

  listeBeneficiaires: any[] = [

  ];

  index : number = 0; 

  gouvernorats: string[] = ['Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
    'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul',
    'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'];

  totalBeneficiaires: number = this.listeBeneficiaires.length;
  formulaireActif: string = 'beneficiaire';  // Formulaire de création affiché par défaut
  message: string = '';

  // Modèles de données pour les formulaires
  
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
 
  ajouterEnfant() {
    this.nouveauBeneficiaire.children.push({ name: '', age: null });
  }

  supprimerEnfant(index: number) {
    this.nouveauBeneficiaire.children.splice(index, 1);
  }

  getBeneficiaires(): void {
    this.beneficiaryService.getBeneficiaires().subscribe({
      next: (response) => {
        console.log('Liste des bénéficiaires:', response.data.beneficiaries);
        this.beneficiaries = response.data.beneficiaries;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des bénéficiaires :', error);
      }
    });
  }

  creerBeneficiaire() {
    if (!this.nouveauBeneficiaire.name || !this.nouveauBeneficiaire.lastname || !this.nouveauBeneficiaire.email) {
      this.message = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.beneficiaryService.createBeneficiaire(this.nouveauBeneficiaire).subscribe(
      (response) => {
        this.message = 'Bénéficiaire créé avec succès!';
        this.resetBeneficiaireForm(); 
      },
      (error) => {
        this.message = 'Erreur lors de la création du bénéficiaire: ' + error.error.message;
      }
    );
  }

  ouvrirModalModification(beneficiaire: any): void {
    this.nouveauBeneficiaire = { ...beneficiaire }; // Deep copy to avoid binding issues
  }
  updateBeneficiaire(): void {
    if (!this.nouveauBeneficiaire._id) {
      this.message = 'Aucun bénéficiaire sélectionné pour la mise à jour.';
      return;
    }
  
    this.beneficiaryService.updateBeneficiaire(this.nouveauBeneficiaire._id, this.nouveauBeneficiaire)
      .subscribe({
        next: (res) => {
          this.message = 'Bénéficiaire mis à jour avec succès !';
          this.getBeneficiaires(); // Recharge la liste après mise à jour
          this.resetBeneficiaireForm(); // Réinitialise le formulaire
        },
        error: (err) => {
          this.message = 'Erreur lors de la mise à jour du bénéficiaire : ' + err.error.message;
        }
      });
  }

  // In your component
deleteBeneficiaire(id: string): void {
  if (!id) {
    this.showMessage('ID du bénéficiaire invalide', 'error');
    return;
  }

  const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce bénéficiaire? Cette action est irréversible.');
  
  if (confirmation) {
    this.beneficiaryService.deleteBeneficiaire(id).subscribe({
      next: () => {
        this.showMessage('Bénéficiaire supprimé avec succès', 'success');
        // Remove the deleted item from the local array to avoid reloading
        this.beneficiaries = this.beneficiaries.filter(b => b._id !== id);
        // If you were editing this beneficiary, reset the form
        if (this.nouveauBeneficiaire._id === id) {
          this.resetBeneficiaireForm();
        }
      },
      error: (err) => {
        this.showMessage(`Erreur lors de la suppression: ${err.error?.message || err.message}`, 'error');
      }
    });
  }
}

  
  filtrerBeneficiaires() {
    return this.beneficiaries.filter(b => {
      const correspondNom = this.filtreNom ? b.name.toLowerCase().includes(this.filtreNom.toLowerCase()) : true;
      const correspondAge = this.filtreAge ? b.Age === this.filtreAge : true;
      return correspondNom && correspondAge;
    });
  }
  

 
  exportToXLSX() {
    const worksheet = XLSX.utils.json_to_sheet(this.listeBeneficiaires);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bénéficiaires');
    XLSX.writeFile(workbook, 'beneficiaires.xlsx');
  }
  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Liste des Bénéficiaires', 10, 10);
    this.listeBeneficiaires.forEach((beneficiaire, index) => {
      doc.text(`${beneficiaire.nom} ${beneficiaire.prenom} - Age: ${beneficiaire.age} - Tel: ${beneficiaire.telephone}`, 10, 20 + (index * 10));
    });
    doc.save('beneficiaires.pdf');
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    // Optionally, you can add logic to handle the type (e.g., display success or error styles)
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  resetBeneficiaireForm(): void {
    this.nouveauBeneficiaire = { 
      _id: '',
      email: '',
      name: '',
      lastname: '',
      password: '',
      gouvernorat: '',
      Age: 0,
      phoneNumber: '',
      address: '',
      children: []
    };
  }

  resetAffectationForm(): void {
    this.affectation = { 
      idBeneficiaire: null, 
      idDonateur: null 
    };
  }
}


