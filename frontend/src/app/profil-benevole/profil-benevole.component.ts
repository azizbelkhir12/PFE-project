import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profil-benevole',
  standalone: false,
  templateUrl: './profil-benevole.component.html',
  styleUrl: './profil-benevole.component.css'
})
export class ProfilBenevoleComponent {

    utilisateur: any;
    profileForm!: FormGroup;
    afficherProfil: boolean = true; // <-- Assure que le profil s'affiche par défaut

    gouvernorats: string[] = [
      'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
      'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
      'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
      'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
      'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
    ];

    isEditing: { [key: string]: boolean } = {
      nom: false,
      prenom: false,
      dateNaissance: false,
      sexe: false,
      telephone: false,
      gouvernorat: false,
      delegation: false,
      adresse: false,
      email: false,
      age: false
    };

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
      // Initialisation de l'utilisateur
      this.utilisateur = {
        nom: 'Ghazouani',
        prenom: 'Amal',
        dateNaissance: '2001-01-01',
        sexe: 'Femme',
        telephone: '12345678',
        gouvernorat: 'Ariana',
        delegation: 'La Soukra',
        adresse: 'Rue des Jasmins',
        age: 22,
        email: 'amal@example.com',
        photoUrl: '' // photo par défaut si pas de photo
      };

      // Création du FormGroup avec les valeurs initiales
      this.profileForm = this.fb.group({
        nom: [this.utilisateur.nom],
        prenom: [this.utilisateur.prenom],
        dateNaissance: [this.utilisateur.dateNaissance],
        sexe: [this.utilisateur.sexe],
        telephone: [this.utilisateur.telephone],
        gouvernorat: [this.utilisateur.gouvernorat],
        delegation: [this.utilisateur.delegation],
        adresse: [this.utilisateur.adresse],
        age: [this.utilisateur.age],
        email: [this.utilisateur.email]
      });
    }

    modifierChamp(champ: string): void {
      this.isEditing[champ] = true;
    }

    resetForm(): void {
      // Reset le formulaire à ses valeurs initiales
      this.profileForm.reset();
    }

    onSubmit(): void {
      // Logic to handle form submission
    }

    onPhotoSelected(event: any): void {
      // Logic to handle photo selection
    }
  }



