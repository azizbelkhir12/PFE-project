
import { Component, OnInit } from '@angular/core';
import { DemandeService } from '../services/demande/demande.service';
import { VolunteerService } from '../services/volunteer/volunteer.service';

import { jsPDF } from 'jspdf';  // Import jsPDF
import * as XLSX from 'xlsx';



interface Benevole {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  telephone?: string;
  age: number;
  gouvernorat: string;
  statut: 'actif' | 'inactif';
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

  totalBenevoles = 0;
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

  constructor(
    private demandeService: DemandeService,
    private volunteerService: VolunteerService
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.fetchVolunteers();
  }

  afficherFormulaire(type: string) {
    this.formulaireActif = type;
  }

  mettreAJourStatistiques() {
    this.totalBenevoles = this.benevoles.length;
    this.totalBenevolesActifs = this.benevoles.filter(b => b.statut === 'actif').length;
    this.totalBenevolesInactifs = this.benevoles.filter(b => b.statut === 'inactif').length;
  }

  getFilteredBenevoles(): Benevole[] {
    const normalizedSearchTerm = this.searchTermTelephone ? this.searchTermTelephone.replace(/\D/g, '') : '';
    return this.benevoles.filter(b =>
      b.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedGouvernorat ? b.gouvernorat === this.selectedGouvernorat : true) &&
      (this.selectedStatut ? b.statut === this.selectedStatut : true) &&
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

    if (!confirm(`Voulez-vous vraiment refuser la demande de ${demande.nom} ?`)) return;

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
