import { Component } from '@angular/core';
import {
  faBars,
  faSearch,
  faBell,
  faChevronDown,
  faCog,
  faSignOutAlt,
  faPlus,
  faUsersCog,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbarcompte-admin',
  templateUrl: './navbarcompte-admin.component.html',
  standalone:false,
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
  faUsersCog = faUsersCog;

  isProfileMenuOpen = false;

  // Méthode pour ouvrir/fermer la sidebar
  toggleSidebar() {
    // Implémentez la logique pour ouvrir/fermer la sidebar
    console.log('Sidebar toggled');
  }


  // Méthode pour ouvrir/fermer le menu déroulant du profil
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }
}
