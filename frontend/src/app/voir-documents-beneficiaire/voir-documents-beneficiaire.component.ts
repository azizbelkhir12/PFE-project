import { Component, OnInit } from '@angular/core';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-voir-documents-beneficiaire',
  templateUrl: './voir-documents-beneficiaire.component.html',
  standalone:false,
  styleUrls: ['./voir-documents-beneficiaire.component.css']
})
export class VoirDocumentsBeneficiaireComponent implements OnInit {
  searchText: string = '';
  beneficiaires: any[] = [];

  constructor(private beneficiaryService: BeneficiaryService) {}

  ngOnInit(): void {
    this.fetchBeneficiaires();
  }

  fetchBeneficiaires(): void {
    this.beneficiaryService.getBeneficiaires().subscribe({
      next: (response) => {
        console.log('Bénéficiaires chargés:', response);
        this.beneficiaires = response.data.beneficiaries;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des bénéficiaires:', err);
      }
    });
  }

  get beneficiairesFiltres() {
    return this.beneficiaires.filter(b =>
      (b.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
       b.lastname?.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }


  
}




