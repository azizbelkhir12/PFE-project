import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Chart } from 'chart.js'; // Importer Chart.js

@Component({
  selector: 'app-gestion-des-dons',
  standalone: false,
  templateUrl: './gestion-des-dons.component.html',
  styleUrls: ['./gestion-des-dons.component.css']
})
export class GestionDesDonsComponent implements OnInit {

  totalDons: number = 0;
  totalDonateursActifs: number = 0;
  totalDonsParPeriode: number = 0;
  periodeSelectionnee: string = 'quotidienne'; // Filtre par défaut
  formulaireActif: string = '';
  donsInternationaux: any[] = [];
  dons: any[] = [];
  donForm: FormGroup;
  // Déclaration pour le graphique
  donsChart: any;
nouveauDon: any;
donAModifier: any;

  constructor() {
    this.donForm = new FormGroup({
      donateur: new FormControl('', [Validators.required]),
      montant: new FormControl(0, [Validators.required, Validators.min(1)]),
      date: new FormControl('', [Validators.required]),
      typeDon: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.chargerDons();  // Charger les dons au démarrage
    this.chargerStatistiques();  // Charger les statistiques
    this.createChart(); // Initialiser le graphique
  }

  // Charger les dons et statistiques
  chargerDons() {
    this.dons = [
      { donateur: 'John Doe', montant: 100, date: '2025-03-25', typeDon: 'international' },
      { donateur: 'Jane Smith', montant: 200, date: '2025-03-24', typeDon: 'local' },
      { donateur: 'Alice Brown', montant: 50, date: '2025-03-23', typeDon: 'international' }
    ];
    this.donsInternationaux = this.dons.filter(don => don.typeDon === 'international');
    this.totalDons = this.dons.reduce((total, don) => total + don.montant, 0);
    this.totalDonateursActifs = new Set(this.dons.map(don => don.donateur)).size;
  }

  chargerStatistiques() {
    if (this.periodeSelectionnee === 'quotidienne') {
      this.totalDonsParPeriode = this.dons.filter(don => this.isDonToday(don.date)).reduce((total, don) => total + don.montant, 0);
    }
  }

  isDonToday(date: string): boolean {
    const today = new Date();
    const donDate = new Date(date);
    return today.toDateString() === donDate.toDateString();
  }

  filtrerDonsParPeriode() {
    this.chargerStatistiques();
    this.createChart();  // Mettre à jour le graphique après changement de période
  }

  afficherFormulaire(formulaire: string) {
    this.formulaireActif = formulaire;
  }

  ajouterDon() {
    if (this.donForm.valid) {
      this.dons.push({ ...this.donForm.value });
      this.chargerDons();
      this.formulaireActif = ''; // Fermer le formulaire
    }
  }

  modifierDon() {
    this.chargerDons();
    this.formulaireActif = ''; // Fermer le formulaire
  }

  supprimerDon(don: any) {
    this.dons = this.dons.filter(d => d.donateur !== don.donateur); // Suppression par donateur
    this.chargerDons();
  }

  // Créer le graphique avec Chart.js
  createChart() {
    const labels = this.dons.map(don => don.date);
    const data = this.dons.map(don => don.montant);

    if (this.donsChart) {
      this.donsChart.destroy(); // Détruire l'ancien graphique pour éviter les superpositions
    }

    this.donsChart = new Chart('donChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Évolution des dons',
          data: data,
          borderColor: '#4BC0C0',
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Montant des dons'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
}
