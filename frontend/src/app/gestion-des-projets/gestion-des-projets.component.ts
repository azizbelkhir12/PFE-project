import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-des-projets',
  templateUrl: './gestion-des-projets.component.html',
  standalone: false,
  styleUrls: ['./gestion-des-projets.component.css']
})
export class GestionDesProjetsComponent implements OnInit {

  formulaireActif: 'ajout' | 'liste' = 'ajout';
  rechercheTitre = '';
  rechercheDate: string | null = null;
  rechercheStatut = '';

  totalProjets = 0;
  totalProjetsEnCours = 0;
  totalProjetsTermines = 0;
  totalProjetsEnRetard = 0;

  enEdition = false; // <- pour distinguer ajout vs modification

  projets: any[] = [
    {
      id: 1,
      titre: 'Collecte pour la rentrée scolaire',
      description: 'Collecte de fournitures scolaires pour les enfants.',
      dateDebut: '2025-08-01',
      dateFin: '2025-08-15',
      date: '2025-08-01 - 2025-08-15',
      statut: 'en_cours',
      montantSoutenu: 500,
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      titre: 'Fête de l’Aïd',
      description: 'Organiser une fête pour les enfants défavorisés.',
      dateDebut: '2025-07-01',
      dateFin: '2025-07-07',
      date: '2025-07-01 - 2025-07-07',
      statut: 'termine',
      montantSoutenu: 300,
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      titre: 'Aide alimentaire',
      description: 'Distribution de nourriture aux familles nécessiteuses.',
      dateDebut: '2025-09-01',
      dateFin: '2025-09-05',
      date: '2025-09-01 - 2025-09-05',
      statut: 'en_retard',
      montantSoutenu: 200,
      imageUrl: 'https://via.placeholder.com/150'
    }
  ];

  prochainId = 4;

  nouveauProjet = {
    id: 0,
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    montantSoutenu: 0,
    imageUrl: '',
    statut: 'en_cours',
    date: ''
  };

  projetModifie: any;

  ngOnInit(): void {
    this.rafraichirStatistiques();
  }

  afficherFormulaire(type: 'ajout' | 'liste') {
    this.formulaireActif = type;
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.nouveauProjet.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageChangeModif(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.projetModifie.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  soumettreProjet(): void {
    if (
      this.nouveauProjet.titre &&
      this.nouveauProjet.description &&
      this.nouveauProjet.dateDebut &&
      this.nouveauProjet.dateFin &&
      this.nouveauProjet.montantSoutenu > 0
    ) {
      this.nouveauProjet.date = `${this.nouveauProjet.dateDebut} - ${this.nouveauProjet.dateFin}`;

      if (this.enEdition) {
        const index = this.projets.findIndex(p => p.id === this.nouveauProjet.id);
        if (index !== -1) {
          this.projets[index] = { ...this.nouveauProjet };
          alert(`Le projet "${this.nouveauProjet.titre}" a été modifié avec succès.`);
        }
      } else {
        const nouveau = {
          ...this.nouveauProjet,
          id: this.prochainId++
        };
        this.projets.push(nouveau);
        alert('Le projet a été ajouté avec succès !');
      }

      // Réinitialisation
      this.nouveauProjet = {
        id: 0,
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        montantSoutenu: 0,
        imageUrl: '',
        statut: 'en_cours',
        date: ''
      };
      this.enEdition = false;

      this.rafraichirStatistiques();
      this.afficherFormulaire('liste');
    } else {
      alert('Veuillez remplir tous les champs correctement.');
    }
  }

  modifierProjet(projet: any): void {
    this.nouveauProjet = { ...projet };
    this.enEdition = true;
    this.afficherFormulaire('ajout');
  }

  supprimerProjet(projet: any): void {
    const index = this.projets.findIndex(p => p.id === projet.id);
    if (index > -1) {
      this.projets.splice(index, 1);
      this.rafraichirStatistiques();
      alert(`Projet "${projet.titre}" supprimé`);
    }
  }

  terminerProjet(projet: any): void {
    projet.statut = 'termine';
    this.rafraichirStatistiques();
    alert(`Le projet "${projet.titre}" a été marqué comme terminé`);
  }

  getProjetsFiltres(): any[] {
    return this.projets.filter(projet => {
      const titreMatch = projet.titre.toLowerCase().includes(this.rechercheTitre.toLowerCase());
      const dateMatch = !this.rechercheDate || projet.date.includes(this.rechercheDate);
      const statutMatch = !this.rechercheStatut || projet.statut === this.rechercheStatut;
      return titreMatch && dateMatch && statutMatch;
    });
  }

  rafraichirStatistiques(): void {
    this.totalProjets = this.projets.length;
    this.totalProjetsEnCours = this.projets.filter(p => p.statut === 'en_cours').length;
    this.totalProjetsTermines = this.projets.filter(p => p.statut === 'termine').length;
    this.totalProjetsEnRetard = this.projets.filter(p => p.statut === 'en_retard').length;
  }
}
