import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-gestion-beneficiaires',
  templateUrl: './gestion-beneficiaires.component.html',
  standalone:false,
  styleUrls: ['./gestion-beneficiaires.component.css'],
})
export class GestionBeneficiairesComponent {
  nouveauBeneficiaire = {
    _id: '',
    name: '',
    lastname: '',
    address: '',
    email: '',
    password: '',
    phoneNumber: '',
    Age: 0,
    gouvernorat: '',
    children: [{ name: '', age: null }]
  };

  totalBeneficiaires: number = 0;

  beneficiaries: any[] = [];

  gouvernorats: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
    'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul',
    'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  formulaireActif: string = 'beneficiaire';
  message: string = '';

  affectation: any = { idBeneficiaire: null, idDonateur: null };

  filtreNom: string = '';
  filtreAge: number | null = null;

  constructor(private beneficiaryService: BeneficiaryService) {}

  ngOnInit(): void {
    this.getBeneficiaires();
  }

  afficherFormulaire(formulaire: string) {
    this.formulaireActif = formulaire;
    this.message = '';
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
        this.beneficiaries = response.data.beneficiaries;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des bénéficiaires :', error);
      }
    });
  }

  creerBeneficiaire() {
    if (!this.nouveauBeneficiaire.name || !this.nouveauBeneficiaire.lastname || !this.nouveauBeneficiaire.email) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires.',
      });
      return;
    }
    this.beneficiaryService.createBeneficiaire(this.nouveauBeneficiaire).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Bénéficiaire créé avec succès!',
        });
        this.resetBeneficiaireForm();
        this.getBeneficiaires();
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la création du bénéficiaire: ' + error.error.message,
        });
      }
    );
  }

  ouvrirModalModification(beneficiaire: any): void {
    this.nouveauBeneficiaire = { ...beneficiaire };
  }

  updateBeneficiaire(): void {
    if (!this.nouveauBeneficiaire?._id) {
      this.message = 'Aucun bénéficiaire sélectionné pour la mise à jour.';
      return;
    }

    this.beneficiaryService.updateBeneficiaire(this.nouveauBeneficiaire._id, this.nouveauBeneficiaire).subscribe({
      next: () => {
        this.message = 'Bénéficiaire mis à jour avec succès !';
        this.getBeneficiaires();
        this.resetBeneficiaireForm();
      },
      error: (err) => {
        this.message = 'Erreur lors de la mise à jour du bénéficiaire : ' + err.error.message;
      }
    });
  }

  deleteBeneficiaire(id: string): void {
    if (!id) {
      this.showMessage('ID du bénéficiaire invalide', 'error');
      return;
    }

    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action est irréversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.beneficiaryService.deleteBeneficiaire(id).subscribe({
          next: () => {
            this.showMessage('Bénéficiaire supprimé avec succès', 'success');
            this.beneficiaries = this.beneficiaries.filter((b: any) => b._id !== id);
            if (this.nouveauBeneficiaire._id === id) {
              this.resetBeneficiaireForm();
            }
          },
          error: (err) => {
            this.showMessage(`Erreur lors de la suppression: ${err.error?.message || err.message}`, 'error');
          }
        });
      }
    });
  }

  filtrerBeneficiaires() {
    return this.beneficiaries.filter(b => {
      const correspondNom = this.filtreNom ? b.name.toLowerCase().includes(this.filtreNom.toLowerCase()) : true;
      const correspondAge = this.filtreAge !== null ? b.Age === this.filtreAge : true;
      return correspondNom && correspondAge;
    });
  }

  exportToXLSX() {
    const worksheet = XLSX.utils.json_to_sheet(this.beneficiaries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bénéficiaires');
    XLSX.writeFile(workbook, 'beneficiaires.xlsx');
  }

  exportToPDF() {
    if (!this.beneficiaries || this.beneficiaries.length === 0) {
      Swal.fire('Erreur', 'Aucun bénéficiaire à exporter.', 'error');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);
    let y = 20;

    doc.text('Liste des bénéficiaires', 20, y);
    y += 10;

    this.beneficiaries.forEach((beneficiaire: any) => {
      doc.text(`Nom: ${beneficiaire.name} ${beneficiaire.lastname}`, 20, y);
      doc.text(`Email: ${beneficiaire.email}`, 20, y + 6);
      y += 15;
    });

    doc.save('beneficiaires.pdf');
  }

  showMessage(message: string, icon: 'success' | 'error') {
    Swal.fire({
      icon,
      title: icon === 'success' ? 'Succès' : 'Erreur',
      text: message,
    });
  }

  resetBeneficiaireForm() {
    this.nouveauBeneficiaire = {
      _id: '',
      name: '',
      lastname: '',
      address: '',
      email: '',
      password: '',
      phoneNumber: '',
      Age: 0,
      gouvernorat: '',
      children: [{ name: '', age: null }]
    };
  }
}


