import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
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
totalBeneficiaires: any;
  index!: number;
listeBeneficiaires: any;

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
      import('sweetalert2').then(Swal => {
        Swal.default.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Veuillez remplir tous les champs obligatoires.',
        });
      });
      return;
    }
    this.beneficiaryService.createBeneficiaire(this.nouveauBeneficiaire).subscribe(
      (response) => {
        import('sweetalert2').then(Swal => {
          Swal.default.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Bénéficiaire créé avec succès!',
          });
        });
        this.resetBeneficiaireForm(); 
      },
      (error) => {
        import('sweetalert2').then(Swal => {
          Swal.default.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la création du bénéficiaire: ' + error.error.message,
          });
        });
      }
    });
  }

  ouvrirModalModification(beneficiaire: any): void {
    this.nouveauBeneficiaire = { ...beneficiaire };
  }

  updateBeneficiaire(): void {
    if (!this.nouveauBeneficiaire._id) {
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

  import('sweetalert2').then(Swal => {
    Swal.default.fire({
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
    });
  });
}

  
  filtrerBeneficiaires() {
    return this.beneficiaries.filter(b => {
      const correspondNom = this.filtreNom ? b.name.toLowerCase().includes(this.filtreNom.toLowerCase()) : true;
      const correspondAge = this.filtreAge ? b.Age === this.filtreAge : true;
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
      alert('Aucun bénéficiaire à exporter.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(12);
    let y = 20;

    doc.text('Liste des bénéficiaires', 20, y);
    y += 10;

    this.beneficiaries.forEach((beneficiaire) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      const nom = beneficiaire.name || 'Non précisé';
      const prenom = beneficiaire.lastname || 'Non précisé';
      const email = beneficiaire.email || 'Non précisé';
      const age = beneficiaire.Age !== undefined ? beneficiaire.Age : 'Non précisé';
      const telephone = beneficiaire.phoneNumber || 'Non précisé';
      const adresse = beneficiaire.address || 'Non précisée';
      const gouvernorat = beneficiaire.gouvernorat || 'Non précisé';

      doc.text(`Nom : ${nom}`, 20, y); y += 8;
      doc.text(`Prénom : ${prenom}`, 20, y); y += 8;
      doc.text(`Email : ${email}`, 20, y); y += 8;
      doc.text(`Âge : ${age}`, 20, y); y += 8;
      doc.text(`Téléphone : ${telephone}`, 20, y); y += 8;
      doc.text(`Adresse : ${adresse}`, 20, y); y += 8;
      doc.text(`Gouvernorat : ${gouvernorat}`, 20, y); y += 8;

      if (beneficiaire.children && beneficiaire.children.length > 0) {
        doc.text('Enfants:', 20, y); y += 8;
        beneficiaire.children.forEach((child: { name: any; age: any; }) => {
          doc.text(`${child.name} (${child.age} ans)`, 30, y);
          y += 8;
        });
      } else {
        doc.text('Aucun enfant', 20, y);
        y += 8;
      }

      y += 5;

      // Ligne de séparation
      doc.setDrawColor(200); // Couleur gris clair
      doc.line(15, y, 195, y); // Ligne horizontale de gauche à droite
      y += 10;
    });

    doc.save('beneficiaires.pdf');
  }


  showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
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
      children: [{ name: '', age: null }]
    };
  }

  resetAffectationForm(): void {
    this.affectation = {
      idBeneficiaire: null,
      idDonateur: null
    };
  }
}


