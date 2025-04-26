import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-voir-documents-beneficiaire',
  templateUrl: './voir-documents-beneficiaire.component.html',
  standalone:false,
  styleUrls: ['./voir-documents-beneficiaire.component.css']
})
export class VoirDocumentsBeneficiaireComponent implements OnInit {
  searchText: string = '';

  beneficiaires = [
    {
      nom: 'Mohamed Ali',
      documents: [
        { nom: 'Image personnelle', type: 'image', url: 'docs/ali_photo.jpg', icone: 'fas fa-user', couleur: '#6f42c1' },
        { nom: 'Image de la maison', type: 'image', url: 'docs/ali_maison.jpg', icone: 'fas fa-home', couleur: '#fd7e14' },

        { nom: 'Bulletin d’étude', type: 'image', url: 'docs/ali_bulletin.jpg', icone: 'fas fa-file-alt', couleur: '#20c997' },

      ]
    },
    {
      nom: 'Amina Bensalah',
      documents: [
        { nom: 'Image personnelle', type: 'image', url: 'docs/amina_photo.jpg', icone: 'fas fa-user', couleur: '#6f42c1' },
        { nom: 'Image de la maison', type: 'image', url: 'docs/amina_maison.jpg', icone: 'fas fa-home', couleur: '#fd7e14' },

        { nom: 'Bulletin d’étude', type: 'image', url: 'docs/amina_bulletin.jpg', icone: 'fas fa-file-alt', couleur: '#20c997' },
      ]
    }
  ];

  get beneficiairesFiltres() {
    return this.beneficiaires.filter(b =>
      b.nom.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  ngOnInit(): void {}
}




