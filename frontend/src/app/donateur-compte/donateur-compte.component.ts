import { Component } from '@angular/core';

@Component({
  selector: 'app-donateur-compte',
  standalone: false,
  templateUrl: './donateur-compte.component.html',
  styleUrl: './donateur-compte.component.css'
})
export class DonateurCompteComponent {
  typeDonateur: string = '';
  activeSection: string = 'profile';
  userService: any;
utilisateur: any;



  ngOnInit(): void {
    this.typeDonateur = this.userService.getTypeDonateur();
  }

  showSection(section: string) {
    this.activeSection = section;
  }
}

