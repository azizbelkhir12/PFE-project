import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DonorsService } from '../services/donors/donors.service';
import { DonationService } from '../services/donation/donation.service';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-gestion-des-dons',
  templateUrl: './gestion-des-dons.component.html',
  styleUrls: ['./gestion-des-dons.component.css'],
  standalone:false
})
export class GestionDesDonsComponent implements OnInit {
modifierDon(_t144: any) {
throw new Error('Method not implemented.');
}
  @ViewChild('tableDonateurs', { static: false }) tableDonateurs!: ElementRef;

  totalDons: number = 0;
  totalDonateurs: number = 0;
  totalDonsRecus: number = 0;
  totalDonsEnAttente: number = 0;
  formulaireActif: string = 'don'; // ✅ Afficher "Ajouter un Don" par défaut

  dons: any[] = [];
  donors: any[] = [];
  donsFiltres: any[] = [];
  donsChart: any;
  donations: any[] = [];
  searchDonateurs: string = '';
  searchDons: string = '';

  donForm: FormGroup;
  nouveauDon = {
    guestName: '',
    guestEmail: '',
    amount: null,
    paymentMethod: '',
    paymentType: '',
    status: '',
    paymentId: this.generatePaymentId()
  };
  

  constructor(private donorsService: DonorsService, private donationService: DonationService) {
    this.donForm = new FormGroup({
      donateur: new FormControl('', [Validators.required]),
      montant: new FormControl(0, [Validators.required, Validators.min(1)]),
      typeDon: new FormControl('', [Validators.required]),
      modePaiement: new FormControl('', [Validators.required]),
      statut: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.createChart();
    this.fetchDonors();
    this.fetchDonations();
  }

  chargerDons() {
    this.dons = [
      { id: 1, donateur: 'John Doe', montant: 100, typeDon: 'International', modePaiement: 'Carte', statut: 'Confirmé' },
      { id: 2, donateur: 'Jane Smith', montant: 200, typeDon: 'Local', modePaiement: 'Virement', statut: 'En Attente' },
      { id: 3, donateur: 'Alice Brown', montant: 50, typeDon: 'International', modePaiement: 'Espèces', statut: 'Confirmé' }
    ];
    this.filtrerDons();
  }

  mettreAJourStatistiques() {
    this.totalDons = this.dons.reduce((total, don) => total + don.montant, 0);
    this.totalDonateurs = new Set(this.dons.map(don => don.donateur)).size;
    this.totalDonsRecus = this.dons.filter(don => don.statut === 'Confirmé').reduce((total, don) => total + don.montant, 0);
    this.totalDonsEnAttente = this.dons.filter(don => don.statut === 'En Attente').reduce((total, don) => total + don.montant, 0);
  }

  filtrerDons() {
    this.donsFiltres = this.dons.filter(don =>
      don.donateur.toLowerCase().includes(this.searchDons.toLowerCase())
    );
    this.mettreAJourDonateurs();
    this.createChart();
  }

  mettreAJourDonateurs() {
    this.donors = [...new Set(this.dons.map(don => don.donateur))].map(nom => {
      const donsDonateur = this.dons.filter(d => d.donateur === nom);
      return {
        nom,
        nombreDons: donsDonateur.length,
        montantTotal: donsDonateur.reduce((sum, d) => sum + d.montant, 0)
      };
    });
  }

  createChart() {
    if (this.donsChart) {
      this.donsChart.destroy();
    }

    this.donsChart = new Chart('donChart', {
      type: 'bar',
      data: {
        labels: this.donsFiltres.map(don => don.donateur),
        datasets: [{
          label: 'Montant des Dons',
          data: this.donsFiltres.map(don => don.montant),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      }
    });
  }

  afficherFormulaire(form: string) {
    this.formulaireActif = form;
  }


  exporterPDF() {
    const doc = new jsPDF();
    doc.text("Liste des Donateurs", 10, 10);
    this.donors.forEach((donateur, index) => {
      doc.text(`${donateur.nom}: ${donateur.montantTotal} TND`, 10, 20 + index * 10);
    });
    doc.save('donateurs.pdf');
  }

  exporterExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.donors);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.writeFile(wb, 'donateurs.xlsx');
  }
  filteredDonateurs(): any[] {
    return this.donors.filter(donor =>
      donor.name.toLowerCase().includes(this.searchDonateurs.toLowerCase())
    );
  }
  

  filteredDons(): any[] {
    return this.donsFiltres.filter(don =>
      don.donateur.toLowerCase().includes(this.searchDons.toLowerCase())
    );
  }

  fetchDonors() {
    this.donorsService.getDonors().subscribe({
      next: (res: any[]) => {
        this.donors = res;
        console.log("Donors fetched:", this.donors); // Debug
      },
      error: (err) => {
        console.error('Failed to fetch donors:', err);
      }
    });
  }

  fetchDonations() {
    this.donationService.getDonations().subscribe({
      next: (res: any[]) => {
        this.donations = res;
        this.donsFiltres = [...this.donations]; // Initialize filtered list
        this.updateStatistics(); // Update statistics
        console.log("Donations fetched:", this.donations); // Debug
      },
      error: (err) => {
        console.error('Failed to fetch donations:', err);
      }
    });
  }

  updateStatistics() {
    this.totalDons = this.donations.reduce((total, don) => total + don.amount, 0);
    this.totalDonateurs = new Set(
      this.donations.map(don => don.guestName || don.donorId?.name || 'Anonyme')
    ).size;
    this.totalDonsRecus = this.donations
      .filter(don => don.status === 'completed')
      .reduce((total, don) => total + don.amount, 0);
    this.totalDonsEnAttente = this.donations
      .filter(don => don.status === 'pending')
      .reduce((total, don) => total + don.amount, 0);
  }

  ajouterDon() {
    const donationData = {
      amount: this.nouveauDon.amount,
      paymentMethod: this.nouveauDon.paymentMethod,
      paymentType: this.nouveauDon.paymentType.toLowerCase(),
      status: this.nouveauDon.status,
      guestName: this.nouveauDon.guestName,
      guestEmail: this.nouveauDon.guestEmail,
      paymentId: this.generatePaymentId()
    };

    this.donationService.createDonation(donationData).subscribe({
      next: (res) => {
        console.log('Donation added:', res);
        this.fetchDonations(); // Refresh the list
        this.donForm.reset();
        this.resetNouveauDon();
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Le don a été ajouté avec succès !'
        });
      },
      error: (err) => {
        console.error('Error adding donation:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur s\'est produite lors de l\'ajout du don.'
        });
      }
    });
  }

  generatePaymentId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array as unknown as number[]))
      .replace(/\+/g, '')
      .replace(/\//g, '')
      .replace(/=+$/, '');
  }

  resetNouveauDon() {
    this.nouveauDon = {
      guestName: '',
      guestEmail: '',
      amount: null,
      paymentMethod: '',
      paymentType: '',
      status: '',
      paymentId: ''
    };
  }
  
}


