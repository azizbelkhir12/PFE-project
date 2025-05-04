import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-nav-bar-membre',
  standalone: false,
  templateUrl: './nav-bar-membre.component.html',
  styleUrl: './nav-bar-membre.component.css'
})
export class NavBarMembreComponent {
afficherSection: any;
  constructor(private router: Router, private authservice : AuthService) {}

  onLogout(): void {
    this.authservice.logout();
  }
    

}
