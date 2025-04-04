import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  donateurs: any[] = [];
  donsFiltres: any[] = [];
  donsChart: any;
  searchDonateurs: string = '';
  searchDons: string = '';

  donForm: FormGroup;
nouveauDon: any;

  constructor() {
    this.donForm = new FormGroup({
      donateur: new FormControl('', [Validators.required]),
      montant: new FormControl(0, [Validators.required, Validators.min(1)]),
      typeDon: new FormControl('', [Validators.required]),
      modePaiement: new FormControl('', [Validators.required]),
      statut: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.chargerDons();
    this.mettreAJourStatistiques();
    this.createChart();
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
    this.donateurs = [...new Set(this.dons.map(don => don.donateur))].map(nom => {
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

  ajouterDon() {
    if (this.donForm.valid) {
      const newDon = {
        id: this.dons.length + 1,
        ...this.donForm.value
      };
      this.dons.push(newDon);
      this.mettreAJourStatistiques();
      this.donForm.reset(); // ✅ Réinitialiser le formulaire
      this.formulaireActif = 'don'; // ✅ Rester sur le formulaire "Ajouter un Don"
    }
  }

  supprimerDon(id: number) {
    this.dons = this.dons.filter(don => don.id !== id);
    this.mettreAJourStatistiques();
  }

  exporterPDF() {
    const doc = new jsPDF();
    doc.text("Liste des Donateurs", 10, 10);
    this.donateurs.forEach((donateur, index) => {
      doc.text(`${donateur.nom}: ${donateur.montantTotal} TND`, 10, 20 + index * 10);
    });
    doc.save('donateurs.pdf');
  }

  exporterExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.donateurs);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.writeFile(wb, 'donateurs.xlsx');
  }

  filteredDonateurs(): any[] {
    return this.donateurs.filter(donateur =>
      donateur.nom.toLowerCase().includes(this.searchDonateurs.toLowerCase())
    );
  }

  filteredDons(): any[] {
    return this.donsFiltres.filter(don =>
      don.donateur.toLowerCase().includes(this.searchDons.toLowerCase())
    );
  }
}


