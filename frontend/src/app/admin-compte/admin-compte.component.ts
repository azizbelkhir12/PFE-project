import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { faHome, faUsers } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-admin-compte',
  templateUrl: './admin-compte.component.html',
  standalone:false,
  styleUrls: ['./admin-compte.component.css']
})
export class AdminCompteComponent implements OnInit {

  statistics: any = {
    totalDons: 0,
    totalBeneficiaires: 0,
    totalBenevoles: 0,
    totalDonateurs: 0,
    totalParrains: 0,
    totalStandardDonateurs: 0,
    monthlyDons: []
  };
  statisticsService: any;



  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.statisticsService.getStatistics().subscribe(
      (data: any) => {
        this.statistics = data;
        this.createCharts();
      },
      (error: any) => {
        console.error('Erreur de récupération des statistiques', error);
      }
    );
  }

  createCharts() {
    new Chart('donationChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
        datasets: [
          {
            label: 'Dons par mois',
            data: this.statistics.monthlyDons || [5000, 7000, 8000, 6500, 9000],
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            borderColor: '#007bff',
            borderWidth: 2,
            tension: 0.4
          }
        ]
      }
    });

    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Bénévoles', 'Bénéficiaires', 'Donateurs'],
        datasets: [
          {
            label: 'Nombre',
            data: [
              this.statistics.totalBenevoles,
              this.statistics.totalBeneficiaires,
              this.statistics.totalDonateurs
            ],
            backgroundColor: ['#ffc107', '#28a745', '#007bff']
          }
        ]
      }
    });

    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Parrains', 'Standards'],
        datasets: [
          {
            data: [this.statistics.totalParrains, this.statistics.totalStandardDonateurs],
            backgroundColor: ['#ffcc00', '#ff5733']
          }
        ]
      }
    });
  }
}
