import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification/notification.service';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';

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

  // Statistics
  totalNotifications: number = 0;
  notificationsAujourdhui: number = 0;
  derniereNotification: any = null;

  constructor(
    private notificationService: NotificationService,
    private beneficiaryService: BeneficiaryService
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaries();
    this.loadStatistics();
  }

  loadBeneficiaries(): void {
    this.beneficiaryService.getBeneficiaires().subscribe({
      next: (response: any) => {
        // Handle both direct array and wrapped responses
        console.log('Raw Response:', response);
        this.listeBeneficiaires = Array.isArray(response) 
          ? response 
          : (response.data.beneficiaries || []);
        
        this.beneficiairesFiltres = [...this.listeBeneficiaires];
      },
      error: (err) => {
        console.error('Error loading beneficiaries:', err);
        this.message = '❌ Error loading beneficiaries';
      }
    });
  }

  loadStatistics(): void {
    this.notificationService.getNotificationStats().subscribe({
      next: (response: any) => {
        // Handle both direct and wrapped responses
        const stats = response.data || response;
        this.totalNotifications = stats.totalNotifications || 0;
        this.notificationsAujourdhui = stats.notificationsToday || 0;
        this.derniereNotification = stats.lastNotification || null;
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.message = '❌ Error loading statistics';
      }
    });
  }

  filtrerBeneficiaires(): void {
    if (!this.recherche) {
      this.beneficiairesFiltres = [...this.listeBeneficiaires];
      return;
    }
    
    const rechercheLower = this.recherche.toLowerCase();
    this.beneficiairesFiltres = this.listeBeneficiaires.filter(b =>
      (b.name + ' ' + b.lastname).toLowerCase().includes(rechercheLower) ||
      b.email.toLowerCase().includes(rechercheLower)
    );
  }

  envoyerNotification(): void {
    this.notificationService.sendNotification(this.notification).subscribe({
      next: (response) => {
        this.message = '✅ Notification sent successfully!';
        this.loadStatistics(); // Refresh stats after sending
        this.resetForm();
      },
      error: (err) => {
        this.message = '❌ Error sending notification';
        console.error('Error:', err);
      }
    });
  }

  resetForm(): void {
    this.notification = {
      idBeneficiaire: '',
      titre: '',
      contenu: ''
    };
    this.recherche = '';
    this.beneficiairesFiltres = [...this.listeBeneficiaires];
  }
}

