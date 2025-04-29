import { Component , OnInit } from '@angular/core';
import { RapportService  } from '../services/rapport/rapport.service';
import { saveAs } from 'file-saver';

interface FileData {
  data: any;
  contentType: string;
  originalName: string;
}

interface Rapport {
  _id: string;
  titre: string;
  type: string;
  date: Date;
  file: FileData;
}

@Component({
  selector: 'app-rapports',
  standalone: false,
  templateUrl: './rapports.component.html',
  styleUrl: './rapports.component.css'
})
export class RapportsComponent {
  rapports: Rapport[] = [];
  filteredRapports: Rapport[] = [];
  loading = true;
  currentPage = 1;
  itemsPerPage = 6;
  searchTerm = '';
  errorMessage: string | null = null;

  // Mapping des types aux icônes FontAwesome
  typeIcons: { [key: string]: string } = {
    financier: 'fa-file-invoice-dollar',
    litteraire: 'fa-book-open'
  };

  constructor(private rapportService: RapportService) {}

  ngOnInit(): void {
    this.loadRapports();
  }

  loadRapports(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.rapportService.getRapports().subscribe({
      next: (data: any) => {
        this.rapports = data;
        this.filteredRapports = [...this.rapports];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rapports:', error);
        this.errorMessage = 'Erreur lors du chargement des rapports. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  downloadRapport(rapport: Rapport): void {
    this.rapportService.telechargerRapport(rapport._id).subscribe({
      next: (blob: Blob) => {
        saveAs(blob, rapport.file.originalName);
      },
      error: (error) => {
        console.error('Download error:', error);
        this.errorMessage = 'Erreur lors du téléchargement du rapport.';
      }
    });
  }

  filterRapports(): void {
    if (!this.searchTerm) {
      this.filteredRapports = [...this.rapports];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredRapports = this.rapports.filter(rapport => 
        rapport.titre.toLowerCase().includes(term) ||
        rapport.type.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1; // Reset to first page when filtering
  }

  get paginatedRapports(): Rapport[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRapports.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRapports.length / this.itemsPerPage);
  }

  getTypeIcon(type: string): string {
    return this.typeIcons[type] || 'fa-file-alt';
  }

  
}
