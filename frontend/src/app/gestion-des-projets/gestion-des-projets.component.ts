import { Component, OnInit } from '@angular/core';
import { ProjetService } from '../services/projet/projet.service';

@Component({
  selector: 'app-gestion-des-projets',
  templateUrl: './gestion-des-projets.component.html',
  standalone: false,
  styleUrls: ['./gestion-des-projets.component.css']
})
export class GestionDesProjetsComponent implements OnInit {

  formulaireActif: 'ajout' | 'liste' = 'liste';
  rechercheTitre = '';
  rechercheDate: string | null = null;
  rechercheStatut = '';
  enEdition: boolean = false; 

  totalProjets = 0;
  totalProjetsEnCours = 0;
  totalProjetsTermines = 0;
  totalProjetsEnRetard = 0;

  projets: any[] = [];
  selectedImage: File | null = null;
  
  // Modal properties
  showModal = false;
  projetEnEdition: any = null;
  selectedImageForEdit: File | null = null;

  nouveauProjet = {
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    montantSoutenu: 0,
    statut: 'en_cours'
  };

  constructor(private projectService: ProjetService) { }

  ngOnInit(): void {
    this.chargerProjets();
  }

  chargerProjets(): void {
    this.projectService.getProjects().subscribe({
      next: (projets) => {
        this.projets = projets;
        this.rafraichirStatistiques();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets:', err);
        alert('Erreur lors du chargement des projets');
      }
    });
  }

  afficherFormulaire(type: 'ajout' | 'liste') {
    this.formulaireActif = type;
    if (type === 'ajout') {
      this.reinitialiserFormulaire();
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedImage = input.files[0];
    }
  }

  onImageChangeModif(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedImageForEdit = input.files[0];
    }
  }

  soumettreProjet(): void {
    if (!this.selectedImage) {
      alert('Veuillez sélectionner une image');
      return;
    }
  
    this.projectService.addProject(this.nouveauProjet, this.selectedImage).subscribe({
      next: () => {
        alert('Projet ajouté avec succès');
        this.reinitialiserFormulaire();
        this.chargerProjets();
        this.afficherFormulaire('liste');
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du projet:', err);
        alert('Erreur lors de l\'ajout du projet: ' + err.message);
      }
    });
  }
  

  // Modal functions
  openEditModal(projet: any): void {
    this.projetEnEdition = { ...projet };
    this.selectedImageForEdit = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  modifierProjet(): void {
    this.projectService.updateProject(
      this.projetEnEdition._id, 
      this.projetEnEdition, 
      this.selectedImageForEdit || undefined
    ).subscribe({
      next: () => {
        alert('Projet modifié avec succès');
        this.closeModal();
        this.chargerProjets();
      },
      error: (err) => {
        console.error('Erreur lors de la modification:', err);
        alert('Erreur lors de la modification: ' + err.message);
      }
    });
  }

  supprimerProjet(projet: any): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projet.titre}"?`)) {
      this.projectService.deleteProject(projet._id).subscribe({
        next: () => {
          alert('Projet supprimé avec succès');
          this.chargerProjets();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du projet:', err);
          alert('Erreur lors de la suppression du projet');
        }
      });
    }
  }

  terminerProjet(projet: any): void {
    const updatedProjet = { ...projet, statut: 'termine' };
    this.projectService.updateProject(projet._id, updatedProjet)
      .subscribe({
        next: () => {
          alert('Projet marqué comme terminé');
          this.chargerProjets();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du projet:', err);
          alert('Erreur lors de la mise à jour du projet');
        }
      });
  }

  getProjetsFiltres(): any[] {
    return this.projets.filter(projet => {
      const titreMatch = projet.titre.toLowerCase().includes(this.rechercheTitre.toLowerCase());
      const dateMatch = !this.rechercheDate || projet.dateDebut.includes(this.rechercheDate);
      const statutMatch = !this.rechercheStatut || projet.statut === this.rechercheStatut;
      return titreMatch && dateMatch && statutMatch;
    });
  }

  getImageUrl(imageData: string): string {
    if (!imageData) return 'assets/default-image.jpg';
    
    // If it's an Imgur URL (starts with http)
    if (imageData.startsWith('https')) {
      return imageData;
    }
    
    // Fallback for base64 images if needed
    return `data:image/jpeg;base64,${imageData}`;
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-image.jpg';
  }

  rafraichirStatistiques(): void {
    this.totalProjets = this.projets.length;
    this.totalProjetsEnCours = this.projets.filter(p => p.statut === 'en_cours').length;
    this.totalProjetsTermines = this.projets.filter(p => p.statut === 'termine').length;
    this.totalProjetsEnRetard = this.projets.filter(p => p.statut === 'en_retard').length;
  }

  reinitialiserFormulaire(): void {
    this.nouveauProjet = {
      titre: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      montantSoutenu: 0,
      statut: 'en_cours'
    };
    this.selectedImage = null;
  }
}