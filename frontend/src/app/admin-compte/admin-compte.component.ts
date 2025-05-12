import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { faHome, faUsers } from '@fortawesome/free-solid-svg-icons';
import { DonorsService } from '../services/donors/donors.service';
import { DonationService } from '../services/donation/donation.service';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';
import { VolunteerService } from '../services/volunteer/volunteer.service';


@Component({
  selector: 'app-admin-compte',
  templateUrl: './admin-compte.component.html',
  standalone:false,
  styleUrls: ['./admin-compte.component.css']
})
export class AdminCompteComponent implements OnInit {
  donors: any[] = [];
  dons: any[] = [];
  donations: any[] = [];
  beneficiaries: any[] = [];
  benevoles: any[] = [];
  volunteers: any[] = [];

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

constructor(private donorsService: DonorsService, 
            private donationService : DonationService,
            private beneficiaryService : BeneficiaryService, 
            private volunteerService : VolunteerService) {}

  ngOnInit() {
  this.fetchDonors();
  this.fetchDonations();
  this.getBeneficiaires();
  this.fetchVolunteers();

  // Delay chart creation until data is ready
  setTimeout(() => {
    this.createDonationChart();
    this.createUserStatsChart();
    this.createDonorPieChart();
  }, 1500); // Adjust delay based on data load
}



  fetchDonors() {
  this.donorsService.getDonors().subscribe({
    next: (res: any[]) => {
      this.donors = res;

      // Count donor types
      const parrainCount = this.donors.filter(d => d.status === 'parrain').length;
      const standardCount = this.donors.filter(d => d.status === 'standard').length;

      this.statistics.totalDonateurs = this.donors.length;
      this.statistics.totalParrains = parrainCount;
      this.statistics.totalStandardDonateurs = standardCount;

      console.log("Donors fetched:", this.donors);
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

      // Sum donation amounts
      const total = this.donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
      this.statistics.totalDons = total;

      console.log("Donations fetched:", this.donations);
    },
    error: (err) => {
      console.error('Failed to fetch donations:', err);
    }
  });
}


  getBeneficiaires(): void {
  this.beneficiaryService.getBeneficiaires().subscribe({
    next: (response) => {
      this.beneficiaries = response.data.beneficiaries;
      this.statistics.totalBeneficiaires = this.beneficiaries.length;

      console.log('Beneficiaries fetched:', this.beneficiaries);
    },
    error: (error) => {
      console.error('Erreur lors du chargement des bénéficiaires :', error);
    }
  });
}


  fetchVolunteers() {
  this.volunteerService.getVolunteers().subscribe(
    (data: any[]) => {
      this.volunteers = data;
      this.benevoles = data;
      this.statistics.totalBenevoles = this.volunteers.length;

      console.log('Volunteers fetched:', this.volunteers);
    },
    (error) => {
      console.error('Error fetching volunteers:', error);
    }
  );
}

createDonationChart() {
  const monthlySums: { [month: string]: number } = {};

  this.donations.forEach((donation: any) => {
    const date = new Date(donation.date);
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    if (!monthlySums[month]) {
      monthlySums[month] = 0;
    }
    monthlySums[month] += donation.amount || 0;
  });

  const labels = Object.keys(monthlySums);
  const data = Object.values(monthlySums);

  new Chart('donationChart', {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Montant des dons (TND)',
        data: data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3
      }]
    }
  });
}


createUserStatsChart() {
  new Chart('barChart', {
    type: 'pie',
    data: {
      labels: ['Bénéficiaires', 'Bénévoles', 'Donateurs'],
      datasets: [{
        label: 'Nombre',
        data: [
          this.statistics.totalBeneficiaires,
          this.statistics.totalBenevoles,
          this.statistics.totalDonateurs
        ],
        backgroundColor: ['#36a2eb', '#4bc0c0', '#9966ff']
      }]
    }
  });
}

createDonorPieChart() {
  new Chart('pieChart', {
    type: 'bar',
    data: {
      labels: ['Parrains', 'Standards'],
      datasets: [{
        data: [
          this.statistics.totalParrains,
          this.statistics.totalStandardDonateurs
        ],
        backgroundColor: ['#ff6384', '#ffcd56']
      }]
    }
  });
}




  
}
