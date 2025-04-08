import { Component, OnInit } from '@angular/core';
import { DemandeService } from '../services/demande/demande.service';
import { VolunteerService } from '../services/volunteer/volunteer.service';


@Component({
  selector: 'app-gestion-benevoles',
  standalone: false,
  templateUrl: './gestion-benevoles.component.html',
  styleUrls: ['./gestion-benevoles.component.css']
})
export class GestionBenevolesComponent {
  
  benevoles: any[] = [];
  

  gouvernorats: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
    'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul',
    'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  totalBenevoles = 0;
  totalBenevolesActifs = 0;
  totalBenevolesInactifs = 0;
  

  benevoleStatut = { id: '', statut: 'actif' };
  demandesBenevolat: any[] = [];
  isLoading = false;
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
  volunteers: any[] = [];


  constructor(private demandeService: DemandeService, private volunteerService: VolunteerService) {}

  afficherFormulaire(type: string) {
    this.formulaireActif = type;
  }

  ngOnInit(): void {
    this.loadDemandes();
    this.fetchVolunteers();
  }

  loadDemandes(): void {
    this.isLoading = true;
    this.demandeService.getAllDemandes().subscribe({
      next: (demandes) => {
        this.demandesBenevolat = demandes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading demandes', err);
        this.isLoading = false;
        alert('Erreur lors du chargement des demandes');
      }
    });
  }

  accepterDemande(demande: any): void {
    if (!confirm('Voulez-vous vraiment accepter cette demande ?')) return;

    this.isLoading = true;
    this.demandeService.acceptDemande(demande._id).subscribe({
      next: () => {
        this.loadDemandes();
        alert('Demande acceptée avec succès !');
      },
      error: (err) => {
        console.error('Error accepting demande', err);
        alert('Erreur lors de l\'acceptation de la demande');
        this.isLoading = false;
      }
    });
  }

  refuserDemande(demande: any): void {
    if (!demande || !demande._id) {
      console.error('Invalid demande object or missing _id');
      return;
    }
  
    if (!confirm(`Voulez-vous vraiment refuser la demande de ${demande.name} ?`)) return;
  
    this.isLoading = true;
    this.demandeService.rejectDemande(demande._id).subscribe({
      next: () => {
        this.demandesBenevolat = this.demandesBenevolat.filter(d => d._id !== demande._id);
        this.isLoading = false;
        alert('Demande refusée avec succès');
      },
      error: (err) => {
        console.error('Error rejecting demande:', err);
        this.isLoading = false;
        alert('Erreur lors du refus de la demande');
      }
    });
  }
  changerStatutBenevole() {

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
