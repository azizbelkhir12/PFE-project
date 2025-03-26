import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-beneficiaires',
  templateUrl: './gestion-beneficiaires.component.html',
  standalone: false,
  styleUrls: ['./gestion-beneficiaires.component.css']
})
export class GestionBeneficiairesComponent {

  // ✅ Liste des bénéficiaires et donateurs (données simulées pour test)
  listeBeneficiaires: any[] = [
    { id: 1, nom: 'Ahmed', prenom: 'Ben Ali', age: 25, telephone: '12345678', gouvernorat: 'Tunis', besoin: 'Aide financière' },
    { id: 2, nom: 'Fatma', prenom: 'Trabelsi', age: 30, telephone: '98765432', gouvernorat: 'Sfax', besoin: 'Soins médicaux' }
  ];

  listeDonateurs: any[] = [
    { id: 1, nom: 'Mohamed', prenom: 'Saidi' },
    { id: 2, nom: 'Leila', prenom: 'Jebali' }
  ];

  gouvernorats: string[] = ['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Gabès'];

  // ✅ Variables pour gérer les formulaires et les messages
  totalBeneficiaires: number = this.listeBeneficiaires.length;
  formulaireActif: string = 'ajout';
  message: string = ''; // Message affiché après une action

  // ✅ Modèles de données pour les formulaires
  nouveauBeneficiaire: any = { nom: '', prenom: '', age: 0, telephone: '', gouvernorat: '', besoin: '' };
  affectation: any = { idBeneficiaire: 0, idDonateur: 0 };
  beneficiaireSelectionne: number | null = null;  // ✅ Initialisation correcte

  /**
   * ✅ Changer le formulaire affiché
   */
  afficherFormulaire(formulaire: string) {
    this.formulaireActif = formulaire;
    this.message = ''; // Réinitialise les messages à chaque changement de formulaire
  }

  /**
   * ✅ Ajouter un nouveau bénéficiaire
   */
  creerBeneficiaire() {
    if (!this.nouveauBeneficiaire.nom || !this.nouveauBeneficiaire.age || !this.nouveauBeneficiaire.telephone) {
      this.message = "⚠️ Veuillez remplir tous les champs requis.";
      return;
    }

    const nouvelId = this.listeBeneficiaires.length + 1;
    const nouveau = { id: nouvelId, ...this.nouveauBeneficiaire };

    this.listeBeneficiaires.push(nouveau);
    this.totalBeneficiaires = this.listeBeneficiaires.length;
    this.message = "✅ Bénéficiaire ajouté avec succès !";

    this.nouveauBeneficiaire = { nom: '', prenom: '', age: 0, telephone: '', gouvernorat: '', besoin: '' };
  }

  /**
   * ✅ Supprimer un bénéficiaire avec vérification
   */
  confirmerSuppression(id: number | null) {
    if (id === null) {
      this.message = "⚠️ Aucun bénéficiaire sélectionné.";
      return;
    }

    const index = this.listeBeneficiaires.findIndex(b => b.id === id);
    if (index !== -1) {
      this.listeBeneficiaires.splice(index, 1);
      this.totalBeneficiaires = this.listeBeneficiaires.length;
      this.message = `❌ Bénéficiaire supprimé avec succès.`;
    } else {
      this.message = "⚠️ Erreur : Bénéficiaire introuvable.";
    }
  }

  /**
   * ✅ Modifier un bénéficiaire
   */
  modifierBeneficiaire(beneficiaire: any) {
    this.nouveauBeneficiaire = { ...beneficiaire };
    this.message = `✏️ Modification du bénéficiaire ${beneficiaire.nom} en cours...`;
  }

  /**
   * ✅ Affecter un bénéficiaire à un donateur avec conversion correcte
   */
  affecterBeneficiaire() {
    const idBeneficiaire = Number(this.affectation.idBeneficiaire);
    const idDonateur = Number(this.affectation.idDonateur);

    if (!idBeneficiaire || !idDonateur) {
      this.message = "⚠️ Veuillez sélectionner un bénéficiaire et un donateur.";
      return;
    }

    const beneficiaire = this.listeBeneficiaires.find(b => b.id === idBeneficiaire);
    const donateur = this.listeDonateurs.find(d => d.id === idDonateur);

    if (beneficiaire && donateur) {
      this.message = `✅ ${beneficiaire.nom} a été affecté à ${donateur.nom}.`;
    } else {
      this.message = "❌ Erreur : Bénéficiaire ou Donateur introuvable.";
    }

    this.affectation = { idBeneficiaire: 0, idDonateur: 0 };
  }
}
