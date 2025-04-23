import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-feedback',
  standalone: false,
  templateUrl: './gestion-feedback.component.html',
  styleUrl: './gestion-feedback.component.css'
})
export class GestionFeedbackComponent implements OnInit {

  totalFeedbacks: number = 0;
  feedbacks: any[] = [];

  ngOnInit(): void {
    // Simuler des données de feedback pour l'affichage
    this.feedbacks = [
      {
        nom: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        sujet: 'Problème de connexion',
        message: 'Je n’arrive pas à me connecter à mon compte.'
      },
      {
        nom: 'Marie Curie',
        email: 'marie.curie@example.com',
        sujet: 'Suggestion',
        message: 'Ce serait bien d’ajouter un mode sombre.'
      }
    ];

    this.totalFeedbacks = this.feedbacks.length;}}

