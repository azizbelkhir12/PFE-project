import { Component } from '@angular/core';
import {
  faBars,
  faSearch,
  faBell,
  faChevronDown,
  faCog,
  faSignOutAlt,
  faPlus,
  faUsersCog, // Importez l'icône faUsersCog
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbarcompte-admin',
  templateUrl: './navbarcompte-admin.component.html',
  styleUrls: ['./navbarcompte-admin.component.css'],
})
export class NavbarcompteAdminComponent {
  // Déclarez les icônes
  faBars = faBars;
  faSearch = faSearch;
  faBell = faBell;
  faChevronDown = faChevronDown;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faPlus = faPlus;
  faUsersCog = faUsersCog; // Déclarez l'icône faUsersCog

  isProfileMenuOpen = false;

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleSidebar() {
    // Implémentez la logique pour ouvrir/fermer la sidebar
  }
}
