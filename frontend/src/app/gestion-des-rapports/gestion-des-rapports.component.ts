import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf'; 
import { RapportService } from '../services/rapport/rapport.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gestion-des-rapports',
  templateUrl: './gestion-des-rapports.component.html',
  standalone: false,
  styleUrls: ['./gestion-des-rapports.component.css']
})
export class GestionDesRapportsComponent implements OnInit{
  afficherFormulaire = false;
  totalRapports = 0;
  rapportsPublies = 0;
  rapportsFinanciers = 0;
  rapportsLitteraires = 0;

  rapport = {
    titre: '',
    type: '',
    file: null as File | null
  };

  rapports: any[] = [];
  filteredRapports: any[] = [];
  rechercheTitre = '';
  rechercheDate = '';
  isLoading = false;

  constructor(private rapportService: RapportService, private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerRapports();
  }

  chargerRapports(): void {
    this.isLoading = true;
    this.rapportService.getRapports().subscribe({
      next: (data: any) => {
        this.rapports = data;
        this.filteredRapports = [...this.rapports];
        this.calculerStatistiques();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rapports:', error);
        this.showErrorAlert('Erreur lors du chargement des rapports');
        this.isLoading = false;
      }
    });
  }

  calculerStatistiques(): void {
    this.totalRapports = this.filteredRapports.length;
    this.rapportsPublies = this.filteredRapports.filter(r => r.publie).length;
    this.rapportsFinanciers = this.filteredRapports.filter(r => r.type === 'financier').length;
    this.rapportsLitteraires = this.filteredRapports.filter(r => r.type === 'litteraire').length;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.rapport.file = file;
    }
  }

  ajouterRapport(): void {
    if (!this.rapport.titre || !this.rapport.type || !this.rapport.file) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs',
        showConfirmButton: true
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('titre', this.rapport.titre);
    formData.append('type', this.rapport.type);
    formData.append('file', this.rapport.file);
  
    this.rapportService.ajouterRapport(formData).subscribe({
      next: (response: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Rapport ajouté avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        this.rapport = { titre: '', type: '', file: null };
        this.chargerRapports();
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du rapport:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de l\'ajout du rapport',
          showConfirmButton: true
        });
      }
    });
  }
  

  supprimerRapport(id: string): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer ce rapport? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rapportService.supprimerRapport(id).subscribe({
          next: () => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Suppression réussie',
              showConfirmButton: false,
              timer: 1500
            });
            this.chargerRapports();
          },
          error: (error) => {
            console.error('Erreur:', error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Erreur',
              text: 'La suppression a échoué',
              showConfirmButton: true
            });
          }
        });
        
      }
    });
  }

  telechargerRapport(id: string): void {
    this.rapportService.telechargerRapport(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const rapport = this.rapports.find(r => r._id === id);
        const fileName = rapport?.file?.originalName || `rapport_${id}`;
        
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showSuccessAlert('Téléchargement commencé');
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement:', error);
        this.showErrorAlert('Erreur lors du téléchargement du rapport');
      }
    });
  }

  getRapportsFiltres(): any[] {
    let filtered = [...this.rapports];
    
    if (this.rechercheTitre) {
      filtered = filtered.filter(r => 
        r.titre.toLowerCase().includes(this.rechercheTitre.toLowerCase())
      );
    }
    
    if (this.rechercheDate) {
      const searchDate = new Date(this.rechercheDate).toISOString().split('T')[0];
      filtered = filtered.filter(r => {
        const rapportDate = r.createdAt 
          ? new Date(r.createdAt).toISOString().split('T')[0] 
          : new Date(r.date).toISOString().split('T')[0];
        return rapportDate === searchDate;
      });
    }
    
    this.filteredRapports = filtered;
    this.calculerStatistiques();
    
    return this.filteredRapports;
  }

  // SweetAlert helper methods
  private showSuccessAlert(message: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000
    });
  }

  private showWarningAlert(message: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: message,
      showConfirmButton: false,
      timer: 3000
    });
  }
}
