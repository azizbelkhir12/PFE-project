import { Component } from '@angular/core';
import {
  faAlignJustify,
  faEnvelope,
  faAngleDown,
  faSlidersH,
  faRightFromBracket,
  faCirclePlus,
  faUserShield,
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
  faCirclePlus = faCirclePlus;
  faUserShield = faUserShield;

  isProfileMenuOpen = false;

  constructor(private authService: AuthService) {}

  toggleSidebar() {
    console.log('Sidebar toggled');
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
