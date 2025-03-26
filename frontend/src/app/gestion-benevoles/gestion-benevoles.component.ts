import { Component } from '@angular/core';

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

interface DemandeBenevolat {
  nom: string;
  prenom: string;
  email: string;
  age: number;
  gouvernorat: string;
  telephone: string;
  raison: string;
}

@Component({
  selector: 'app-gestion-benevoles',
  standalone: false,
  templateUrl: './gestion-benevoles.component.html',
  styleUrls: ['./gestion-benevoles.component.css']
})
export class GestionBenevolesComponent {

  benevoles: Benevole[] = [
    { id: 1, nom: 'Ahmed', prenom: 'Ali', email: 'ahmed@example.com', age: 25, gouvernorat: 'Tunis', statut: 'actif' },
    { id: 2, nom: 'Sara', prenom: 'Ben Salah', email: 'sara@example.com', age: 30, gouvernorat: 'Sfax', statut: 'inactif' },
    { id: 3, nom: 'Karim', prenom: 'Jaziri', email: 'karim@example.com', age: 28, gouvernorat: 'Ariana', statut: 'actif' }
  ];

  gouvernorats: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
    'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul',
    'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  totalBenevoles = 0;
  totalBenevolesActifs = 0;
  totalBenevolesInactifs = 0;

  nouveauBenevole: Benevole = this.resetBenevole();

  benevoleStatut = { id: 0, statut: 'actif' };

  demandesBenevolat: DemandeBenevolat[] = [
    { nom: 'Mehdi', prenom: 'Trabelsi', email: 'mehdi@example.com', age: 22, gouvernorat: 'Tunis', telephone: '12345678', raison: 'Aider les enfants défavorisés' },
    { nom: 'Amira', prenom: 'Mansour', email: 'amira@example.com', age: 27, gouvernorat: 'Sousse', telephone: '98765432', raison: 'Participer à des actions humanitaires' }
  ];

  formulaireActif: string = 'benevole';

  constructor() {
    this.mettreAJourStatistiques();
  }

  creerBenevole() {
    if (!this.nouveauBenevole.nom || !this.nouveauBenevole.prenom || !this.nouveauBenevole.email ||
        !this.nouveauBenevole.motDePasse || this.nouveauBenevole.age <= 0 || !this.nouveauBenevole.gouvernorat) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (this.benevoles.some(b => b.email === this.nouveauBenevole.email)) {
      alert('Cet email est déjà utilisé.');
      return;
    }

    this.nouveauBenevole.id = this.benevoles.length + 1;
    this.benevoles.push({ ...this.nouveauBenevole });
    this.nouveauBenevole = this.resetBenevole();
    this.mettreAJourStatistiques();
    alert('Bénévole ajouté avec succès !');
  }

  changerStatutBenevole() {
    const benevole = this.benevoles.find(b => b.id === this.benevoleStatut.id);
    if (!benevole) {
      alert('Aucun bénévole trouvé avec cet ID.');
      return;
    }
    benevole.statut = this.benevoleStatut.statut as 'actif' | 'inactif';
    this.mettreAJourStatistiques();
    alert('Statut mis à jour avec succès !');
  }

  accepterDemande(demande: DemandeBenevolat) {
    const nouveau: Benevole = {
      id: this.benevoles.length + 1,
      nom: demande.nom,
      prenom: demande.prenom,
      email: demande.email,
      motDePasse: '123456',
      age: demande.age,
      gouvernorat: demande.gouvernorat,
      telephone: demande.telephone,
      statut: 'actif'
    };
    this.benevoles.push(nouveau);
    this.demandesBenevolat = this.demandesBenevolat.filter(d => d.email !== demande.email);
    this.mettreAJourStatistiques();
    alert('Demande acceptée et bénévole ajouté !');
  }

  refuserDemande(email: string) {
    this.demandesBenevolat = this.demandesBenevolat.filter(d => d.email !== email);
    alert('Demande refusée.');
  }

  mettreAJourStatistiques() {
    this.totalBenevoles = this.benevoles.length;
    this.totalBenevolesActifs = this.benevoles.filter(b => b.statut === 'actif').length;
    this.totalBenevolesInactifs = this.benevoles.filter(b => b.statut === 'inactif').length;
  }

  afficherFormulaire(type: string) {
    this.formulaireActif = type;
  }

  private resetBenevole(): Benevole {
    return { id: 0, nom: '', prenom: '', email: '', motDePasse: '', age: 0, gouvernorat: '', statut: 'actif' };
  }
}
