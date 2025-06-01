import { Component,EventEmitter, Output  } from '@angular/core';
import {
  faAlignJustify,
  faEnvelope,
  faAngleDown,
  faSlidersH,
  faRightFromBracket,
  faCirclePlus,
  faUserShield,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-navbarcompte-admin',
  templateUrl: './navbarcompte-admin.component.html',
  standalone: false,
  styleUrls: ['./navbarcompte-admin.component.css'],
})
export class NavbarcompteAdminComponent {
  faAlignJustify = faAlignJustify;
  faEnvelope = faEnvelope;
  faAngleDown = faAngleDown;
  faSlidersH = faSlidersH;
  faRightFromBracket = faRightFromBracket;
  faUserShield = faUserShield;
  faTimes = faTimes;

  isProfileMenuOpen = false;
  @Output() sidebarToggled = new EventEmitter<boolean>();
  isSidebarOpen = false;

  constructor(private authService: AuthService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggled.emit(this.isSidebarOpen);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
