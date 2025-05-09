import { Component , OnInit} from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { DonorsService } from '../services/donors/donors.service';

@Component({
  selector: 'app-parinnage-enfants',
  standalone: false,
  templateUrl: './parinnage-enfants.component.html',
  styleUrl: './parinnage-enfants.component.css'
})
export class ParinnageEnfantsComponent implements OnInit {

  donorData: any;

  constructor(private authService: AuthService, private donorsService: DonorsService) { }


  ngOnInit(): void {
  const donorId = this.authService.getCurrentUserId(); 
  if (donorId) {
    this.donorsService.getDonorWithBeneficiaries(donorId).subscribe(data => {
      this.donorData = data;
    });
  } else {
    console.error('Donor ID is null');
  }
}

}
