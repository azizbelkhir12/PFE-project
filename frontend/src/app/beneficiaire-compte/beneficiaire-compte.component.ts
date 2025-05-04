import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-beneficiaire-compte',
  templateUrl: './beneficiaire-compte.component.html',
  styleUrls: ['./beneficiaire-compte.component.css'],
  standalone: false
})
export class BeneficiaireCompteComponent implements OnInit {
  sectionActive: string = 'profil';
  utilisateur: any = { nom: 'Chargement...' }; // Default value
  documentsComplete: any = {};
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private beneficiaryService: BeneficiaryService
  ) {}

  ngOnInit(): void {
    this.utilisateur = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loadBeneficiaryData();
  }
  

  loadBeneficiaryData(): void {
    const token = this.authService.token;
  
    if (!token) {
      this.errorMessage = 'Veuillez vous connecter pour accéder à cette page';
      this.isLoading = false;
      return;
    }
  
    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id;
  
      if (!userId) {
        throw new Error('ID utilisateur non trouvé dans le token');
      }
  
      this.beneficiaryService.getBeneficiaireById(userId).subscribe({
        next: (data) => {
          // Ici on récupère bien les infos dans data.data.beneficiary
          const beneficiary = data.data.beneficiary;
          this.utilisateur = beneficiary;
          this.documentsComplete = data.data.documents || {};
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = 'Erreur lors du chargement des données';
          this.isLoading = false;
  
          // Fallback localStorage
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            this.utilisateur.nom = parsedUser?.nom || 'Utilisateur';
          } else {
            this.utilisateur.nom = 'Utilisateur';
          }
        }
      });
    } catch (e) {
      console.error('Erreur de décodage:', e);
      this.errorMessage = 'Problème d\'authentification';
      this.isLoading = false;
  
      // Fallback localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        this.utilisateur.nom = parsedUser?.nom || 'Utilisateur';
      } else {
        this.utilisateur.nom = 'Utilisateur';
      }
    }
  }
  
  afficherSection(section: string): void {
    this.sectionActive = section;
  }
  verifierDocumentsComplets(): boolean {
    return Object.values(this.documentsComplete).every(doc => doc === true);
  }

  modifierEmail(): void {
    this.utilisateur.email = 'nouveau-email@example.com';
  }

  modifierNom(): void {
    this.utilisateur.nom = 'NouveauNom';
  }

  afficherMessageDocuments(): string {
    return this.verifierDocumentsComplets()
      ? 'Tous les documents sont complets.'
      : 'Il manque des documents à soumettre.';
  }
}
