import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar-membre',
  standalone: false,
  templateUrl: './nav-bar-membre.component.html',
  styleUrl: './nav-bar-membre.component.css'
})
export class NavBarMembreComponent {
afficherSection: any;
  constructor(private router: Router) {}

  seDeconnecter() {
    // Ici, tu peux aussi vider le localStorage ou les tokens si nécessaire
    this.router.navigate(['/']);

}}
