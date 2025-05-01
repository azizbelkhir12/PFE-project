import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voir-notifications-beneficiaire',
  templateUrl: './voir-notifications-beneficiaire.component.html',
  standalone:false,
  styleUrls: ['./voir-notifications-beneficiaire.component.css']
})
export class VoirNotificationsBeneficiaireComponent implements OnInit {
  notifications: {
title: any; message: string, date: string
}[] = [];

  constructor() {}

  ngOnInit(): void {
    // Simuler des notifications pour les tests
    this.notifications = [
      {
        message: 'Votre profil a été mis à jour avec succès.', date: '2025-04-20',
        title: "nouveau versement"
      },
      {
        message: 'Nouveau projet disponible pour les bénéficiaires.', date: '2025-04-21',
        title: "deuxieme versement"
      },
      {
        message: 'Votre document a été validé par l\'administration.', date: '2025-04-22',
        title: "troisieme versement"
      }
    ];
  }
}
