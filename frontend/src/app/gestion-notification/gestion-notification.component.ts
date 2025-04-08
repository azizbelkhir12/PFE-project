import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-notification',
  templateUrl: './gestion-notification.component.html',
  standalone:false,
  styleUrls: ['./gestion-notification.component.css'],
})
export class GestionNotificationComponent implements OnInit {
  message: string = '';

  notification = {
    idBeneficiaire: '',
    titre: '',
    contenu: ''
  };

  listeBeneficiaires: any[] = [];
  beneficiairesFiltres: any[] = [];

  recherche: string = '';

  // Statistiques
  totalNotifications: number = 0;
  notificationsAujourdhui: number = 0;
  derniereNotification: any = null;
  dateDernierEnvoi: string = '';

  constructor() {}

  ngOnInit(): void {
    this.recupererBeneficiaires();
  }

  recupererBeneficiaires(): void {
    // 🔄 À remplacer par un service HTTP
    this.listeBeneficiaires = [
      { id: '1', nom: 'Ben Salah', prenom: 'Amina' },
      { id: '2', nom: 'Mejri', prenom: 'Sami' },
      { id: '3', nom: 'Trabelsi', prenom: 'Nada' },
      { id: '4', nom: 'Khalil', prenom: 'Youssef' }
    ];

    this.beneficiairesFiltres = this.listeBeneficiaires;
  }

  filtrerBeneficiaires(): void {
    const rechercheLower = this.recherche.toLowerCase();
    this.beneficiairesFiltres = this.listeBeneficiaires.filter(b =>
      (b.nom + ' ' + b.prenom).toLowerCase().includes(rechercheLower)
    );
  }

  envoyerNotification(): void {
    console.log('Notification envoyée :', this.notification);
    this.message = '✅ Notification envoyée avec succès !';

    // Mettre à jour les statistiques
    this.totalNotifications++;

    const auj = new Date().toDateString();
    if (this.dateDernierEnvoi !== auj) {
      this.dateDernierEnvoi = auj;
      this.notificationsAujourdhui = 1;
    } else {
      this.notificationsAujourdhui++;
    }

    this.derniereNotification = { ...this.notification };

    // Réinitialiser le formulaire
    this.notification = {
      idBeneficiaire: '',
      titre: '',
      contenu: ''
    };

    this.recherche = '';
    this.beneficiairesFiltres = this.listeBeneficiaires;
  }
}

