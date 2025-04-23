import { Component } from '@angular/core';
import {
  faUsers,
  faHandHoldingHeart,
  faDonate,
  faBell,
  faChartBar,
  faNewspaper,
  faProjectDiagram,
  faComments,
  faChevronUp,
  faChevronDown,
  faPlus,
  faEdit,
  faList,
  faLink,
  faEnvelope,
  faDownload,
  faUpload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  standalone:false,
  styleUrls: ['./sidebar-admin.component.css'],
})
export class SidebarAdminComponent {
  // Icônes principales
  faUsers = faUsers;
  faHandHoldingHeart = faHandHoldingHeart;
  faDonate = faDonate;
  faBell = faBell;
  faChartBar = faChartBar;
  faNewspaper = faNewspaper;
  faProjectDiagram = faProjectDiagram;
  faComments = faComments;
  faTrash = faTrash;

  // Icônes pour les sous-menus
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  faPlus = faPlus;
  faEdit = faEdit;
  faList = faList;
  faLink = faLink;
  faEnvelope = faEnvelope;
  faDownload = faDownload;
  faUpload = faUpload;

  // Fonctionnalité active
  activeFunctionality: string | null = null;

  // État de la sidebar (ouverte/fermée)
  isSidebarOpen = true; // Par défaut, la sidebar est ouverte

  // Définir la fonctionnalité active
  setActiveFunctionality(functionality: string) {
    this.activeFunctionality = functionality;
  }

  // Basculer l'état de la sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
