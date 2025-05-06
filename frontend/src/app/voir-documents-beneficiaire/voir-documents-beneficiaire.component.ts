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


  downloadAllDocuments(beneficiaire: any) {
    const documentEntries = Object.entries(beneficiaire.documents || {});
  
    documentEntries.forEach(([key, url]) => {
      if (url) {
        const link = document.createElement('a');
        link.href = url as string;
        
        // Force the download to use .pdf extension for all documents
        // You might want to make this more sophisticated if you have different file types
        link.download = `${beneficiaire.lastname}_${beneficiaire.name}_${key}.pdf`;
        
        // Add a timestamp to prevent browser caching issues
        link.href = link.href + '?download=' + new Date().getTime();
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }
  
}




