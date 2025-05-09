import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { DonorsService } from '../services/donors/donors.service';

@Component({
  selector: 'app-donateur-compte',
  standalone: false,
  templateUrl: './donateur-compte.component.html',
  styleUrl: './donateur-compte.component.css'
})
export class DonateurCompteComponent {
  typeDonateur: string = '';
  activeSection: string = 'profile';
  utilisateur: any;

  constructor(private authService: AuthService, private donorService: DonorsService) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.donorService.getDonorsById(userId).subscribe({
        next: (donor) => {
          this.utilisateur = donor;  
          this.typeDonateur = donor.status || 'standard';
        },
        error: (error) => {
          console.error('Erreur lors du chargement du donateur :', error);
        }
      });
    }
  }

  showSection(section: string) {
    this.activeSection = section;
  }
}
