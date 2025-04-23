
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DemandeService } from '../services/demande/demande.service';
import { VolunteerService } from '../services/volunteer/volunteer.service';
import Swal from 'sweetalert2';

import { jsPDF } from 'jspdf';  // Import jsPDF
import * as XLSX from 'xlsx';



interface Benevole {
  _id: String;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  telephone?: string;
  age: number;
  gouvernorat: string;
  status: 'active' | 'inactive'; 
}

@Component({
  selector: 'app-gestion-benevoles',
  templateUrl: './gestion-benevoles.component.html',
  standalone: false,
  styleUrls: ['./gestion-benevoles.component.css']
})
export class GestionBenevolesComponent {
  
  benevoles: Benevole[] = [];
  volunteers: any[] = [];
  demandesBenevolat: any[] = [];

  totalBenevoles = this.volunteers.length;
  totalBenevolesActifs = 0;
  totalBenevolesInactifs = 0;

  isLoading = false;

  searchTerm: string = '';
  searchTermTelephone: string = '';
  selectedAge: any = null;
  selectedStatut: string = '';
  selectedGouvernorat: string = '';

  gouvernorats: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
    'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul',
    'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  formulaireActif: string = 'benevole';

  nouveauBenevole: any = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: '',
    age: 0,
    gouvernorat: '',
    statut: 'actif'
  };

  constructor(private volunteerService: VolunteerService,private snackBar: MatSnackBar, private demandeService: DemandeService  ) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.fetchVolunteers();

    
  }

  afficherFormulaire(type: string) {
    this.formulaireActif = type;
  }

  mettreAJourStatistiques() {
    this.totalBenevoles = this.benevoles.length;
    this.totalBenevolesActifs = this.benevoles.filter(b => b.status === 'active').length;
    this.totalBenevolesInactifs = this.benevoles.filter(b => b.status === 'inactive').length;
  }

  getFilteredBenevoles(): Benevole[] {
    const normalizedSearchTerm = this.searchTermTelephone ? this.searchTermTelephone.replace(/\D/g, '') : '';
    return this.benevoles.filter(b =>
      b.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedGouvernorat ? b.gouvernorat === this.selectedGouvernorat : true) &&
      (this.selectedStatut ? b.status === this.selectedStatut : true) &&
      (this.selectedAge ? b.age === this.selectedAge : true) &&
      (normalizedSearchTerm ? b.telephone?.replace(/\D/g, '').includes(normalizedSearchTerm) : true)
    );
  }

  getFilteredDemandes() {
    const normalizedSearchTermTelephone = this.searchTermTelephone.replace(/\D/g, '');
    return this.demandesBenevolat.filter(d =>
      d.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedGouvernorat ? d.gouvernorat === this.selectedGouvernorat : true) &&
      (normalizedSearchTermTelephone ? d.telephone.replace(/\D/g, '').includes(normalizedSearchTermTelephone) : true)
    );
  }

  exportToXLSX() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.demandesBenevolat);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.writeFile(wb, 'demandes_benevolat.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Liste des demandes de bénévolat', 20, 20);
    this.demandesBenevolat.forEach((demande, index) => {
      const startY = 30 + index * 60;
      doc.text(`Nom: ${demande.nom} ${demande.prenom}`, 20, startY);
      doc.text(`Email: ${demande.email}`, 20, startY + 10);
      doc.text(`Âge: ${demande.age}`, 20, startY + 20);
      doc.text(`Gouvernorat: ${demande.gouvernorat}`, 20, startY + 30);
      doc.text(`Téléphone: ${demande.telephone}`, 20, startY + 40);
      doc.text(`Raison: ${demande.raison}`, 20, startY + 50);
      doc.text('--------------------------------------------', 20, startY + 60);
    });
    doc.save('demandes_benevolat_sans_tableau.pdf');
  }

  loadDemandes(): void {
    this.isLoading = true;
    this.demandeService.getAllDemandes().subscribe({
      next: (demandes: any) => {
        this.demandesBenevolat = demandes;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading demandes', err);
        this.isLoading = false;
        alert('Erreur lors du chargement des demandes');
      }
    });
  }

  

accepterDemande(demande: { _id: string }): void {
  Swal.fire({
    title: 'Êtes-vous sûr(e)?',
    text: 'Voulez-vous vraiment accepter cette demande ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, accepter!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.isLoading = true;
      this.demandeService.acceptDemande(demande._id).subscribe({
        next: () => {
          this.loadDemandes();
          Swal.fire('Acceptée!', 'Demande acceptée avec succès!', 'success');
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error accepting demande', err);
          Swal.fire('Erreur', 'Erreur lors de l\'acceptation de la demande', 'error');
          this.isLoading = false;
        }
      });
    }
  });
}




refuserDemande(demande: any): void {
  if (!demande || !demande._id) {
    console.error('Invalid demande object or missing _id');
    return;
  }

  Swal.fire({
    title: 'Êtes-vous sûr(e)?',
    text: `Voulez-vous vraiment refuser la demande de ${demande.nom} ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, refuser!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.isLoading = true;
      this.demandeService.rejectDemande(demande._id).subscribe({
        next: () => {
          this.demandesBenevolat = this.demandesBenevolat.filter(d => d._id !== demande._id);
          this.isLoading = false;
          Swal.fire('Refusée!', 'Demande refusée avec succès', 'success');
        },
        error: (err) => {
          console.error('Error rejecting demande:', err);
          this.isLoading = false;
          Swal.fire('Erreur', 'Erreur lors du refus de la demande', 'error');
        }
      });
    }
  });
}


activateVolunteer(volunteer: Benevole) {
  if (!volunteer?._id) {
    console.error('Invalid volunteer or missing ID', volunteer);
    return;
  }

  Swal.fire({
    title: 'Êtes-vous sûr(e)?',
    text: `Activer le bénévole  ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, activer!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.changeStatus(String(volunteer._id), 'active');
    }
  });
}

deactivateVolunteer(volunteer: Benevole) {
  if (!volunteer?._id) {
    console.error('Invalid volunteer or missing ID', volunteer);
    return;
  }

  Swal.fire({
    title: 'Êtes-vous sûr(e)?',
    text: `Désactiver le bénévole  ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, désactiver!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.changeStatus(String(volunteer._id), 'inactive');
    }
  });
}


  private changeStatus(volunteerId: string, newStatus: 'active' | 'inactive') {
    this.isLoading = true;
    this.volunteerService.changeVolunteerStatus(volunteerId, newStatus).subscribe({
      next: (updatedVolunteer) => {
        // Update the local volunteers array
        const index = this.volunteers.findIndex(v => v._id === volunteerId);
        if (index !== -1) {
          this.volunteers[index].status = newStatus;
        }
        this.snackBar.open(`Statut mis à jour avec succès`, 'Fermer', {
          duration: 3000,
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error changing status:', err);
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }


  fetchVolunteers() {
    this.volunteerService.getVolunteers().subscribe(
      (data: any[]) => {
        this.volunteers = data;
      },
      (error) => {
        console.error('Error fetching volunteers:', error);
      }
    );
  }

  
}
