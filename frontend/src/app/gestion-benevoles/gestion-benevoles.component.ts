import { Component } from '@angular/core';
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
  templateUrl: './gestion-benevoles.component.html',
  standalone: false,
  styleUrls: ['./gestion-benevoles.component.css']
})
export class GestionBenevolesComponent {
totalBeneficiairesActifs: any;
totalBeneficiairesInactifs: any;
totalBeneficiaires: any;
creerBeneficiaire() {
throw new Error('Method not implemented.');
}
nouveauBeneficiaire: any;
changerStatutBeneficiaire() {
throw new Error('Method not implemented.');
}
beneficiaireStatut: any;
getFilteredBeneficiaires(): any {
throw new Error('Method not implemented.');
}
activerBeneficiaire(arg0: any) {
throw new Error('Method not implemented.');
}
desactiverBeneficiaire(arg0: any) {
throw new Error('Method not implemented.');
}
activerBenevole(arg0: number) {
throw new Error('Method not implemented.');
}
desactiverBenevole(arg0: number) {
throw new Error('Method not implemented.');
}
  searchTerm: string = '';
  searchTermTelephone: string = '';  // Champ de recherche pour téléphone
  selectedAge: any = null;
  selectedStatut: any = '';
  selectedGouvernorat: string = '';
  filteredBenevoles: Benevole[] = [];
  formulaireActif: string = 'benevole';
  afficherListeBenevoles: boolean = false;

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

  constructor() {
    this.mettreAJourStatistiques();
  }

  // Méthode pour créer un nouveau bénévole
  creerBenevole() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!this.nouveauBenevole.nom || !this.nouveauBenevole.prenom || !this.nouveauBenevole.email ||
        !this.nouveauBenevole.motDePasse || this.nouveauBenevole.age <= 0 || !this.nouveauBenevole.gouvernorat) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!emailPattern.test(this.nouveauBenevole.email)) {
      alert('L\'email n\'est pas valide.');
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

  // Méthode pour changer le statut d'un bénévole
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

  // Méthode pour accepter une demande de bénévolat
  accepterDemande(demande: DemandeBenevolat) {
    const nouveauBenevole: Benevole = {
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
    this.benevoles.push(nouveauBenevole);
    this.demandesBenevolat = this.demandesBenevolat.filter(d => d.email !== demande.email);
    this.mettreAJourStatistiques();
    alert('Demande acceptée et bénévole ajouté !');
  }

  // Méthode pour refuser une demande de bénévolat
  refuserDemande(email: string) {
    this.demandesBenevolat = this.demandesBenevolat.filter(d => d.email !== email);
    alert('Demande refusée.');
  }

  // Mise à jour des statistiques
  mettreAJourStatistiques() {
    this.totalBenevoles = this.benevoles.length;
    this.totalBenevolesActifs = this.benevoles.filter(b => b.statut === 'actif').length;
    this.totalBenevolesInactifs = this.benevoles.filter(b => b.statut === 'inactif').length;
  }

  // Méthode pour afficher le formulaire pour ajouter un bénévole ou une demande
  afficherFormulaire(type: string) {
    this.formulaireActif = type;
  }

  // Méthode pour afficher la liste des bénévoles
  voirListeBenevoles() {
    this.afficherListeBenevoles = true;
  }

  // Filtrage des bénévoles selon les critères de recherche
  getFilteredBenevoles() {
    const normalizedSearchTerm = this.searchTermTelephone ? this.searchTermTelephone.replace(/\D/g, '') : ''; // Retirer tous les caractères non numériques
    return this.benevoles.filter(b =>
      b.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedGouvernorat ? b.gouvernorat === this.selectedGouvernorat : true) &&
      (this.selectedStatut ? b.statut === this.selectedStatut : true) &&
      (this.selectedAge ? b.age === this.selectedAge : true) &&
      (normalizedSearchTerm ? b.telephone?.replace(/\D/g, '').includes(normalizedSearchTerm) : true) // Filtrage normalisé par téléphone
    );
  }

  // Filtrage des demandes de bénévolat
getFilteredDemandes() {
  // Normalisation du téléphone de recherche pour ignorer les caractères non numériques
  const normalizedSearchTermTelephone = this.searchTermTelephone.replace(/\D/g, ''); // Retirer tous les caractères non numériques du téléphone de recherche

  return this.demandesBenevolat.filter(d =>
    // Filtrage selon le nom
    d.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&

    // Filtrage selon le gouvernorat
    (this.selectedGouvernorat ? d.gouvernorat === this.selectedGouvernorat : true) &&

    // Filtrage par téléphone (normalisé)
    (normalizedSearchTermTelephone ? d.telephone.replace(/\D/g, '').includes(normalizedSearchTermTelephone) : true)
  );
}


  // Exportation des demandes en format XLSX
  exportToXLSX() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.demandesBenevolat);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.writeFile(wb, 'demandes_benevolat.xlsx');
  }

  // Exportation des demandes en format PDF
  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Liste des demandes de bénévolat', 20, 20);
    this.demandesBenevolat.forEach((demande, index) => {
      const startY = 30 + index * 10;
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

  private resetBenevole(): Benevole {
    return { id: 0, nom: '', prenom: '', email: '', motDePasse: '', age: 0, gouvernorat: '', statut: 'actif' };
  }
}
