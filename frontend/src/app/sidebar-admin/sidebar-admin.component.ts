import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  faUsers,
  faHandHoldingHeart,
  faDonate,
  faBell,
  faChartBar,
  faNewspaper,
  faProjectDiagram,
  faComments,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

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
  faBars = faBars;
  faTimes = faTimes;

  @Input() isSidebarOpen = true;
  @Output() sidebarToggled = new EventEmitter<void>();

  // Active functionality
  activeFunctionality: string | null = null;

  setActiveFunctionality(functionality: string) {
    this.activeFunctionality = functionality;
  }

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

  closeSidebar() {
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
      this.sidebarToggled.emit();
      console.log('Sidebar closed');
    }
  }
}
  



