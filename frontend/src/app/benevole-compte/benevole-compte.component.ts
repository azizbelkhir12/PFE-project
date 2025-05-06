import { Component } from '@angular/core';
import { VolunteerService } from '../services/volunteer/volunteer.service';
import { AuthService } from '../services/auth/auth.service'

@Component({
  selector: 'app-benevole-compte',
  standalone: false,
  templateUrl: './benevole-compte.component.html',
  styleUrl: './benevole-compte.component.css'
})
export class BenevoleCompteComponent {
  activeSection: string = 'profil';
  benevole: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  

  constructor(
    private volunteerService: VolunteerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadVolunteerData();
  }

  loadVolunteerData(): void {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      this.isLoading = false;
      return;
    }
  
    this.volunteerService.getVolunteerById(userId).subscribe({
      next: (response) => {
        console.log('Volunteer data loaded:', response);
        // Extract the volunteer object from the nested response
        this.benevole = response.data.volunteer;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading volunteer data:', err);
        this.errorMessage = 'Failed to load volunteer data';
        this.isLoading = false;
      }
    });
  }

  // Basculer entre les sections
  showSection(section: string) {
    this.activeSection = section;
  }

  // Simuler la mise à jour du profil
  updateProfil() {
    alert('Profil mis à jour (simulation) !');
  }

  // Simuler un paiement
  payerAbonnement() {
    
  }
}
