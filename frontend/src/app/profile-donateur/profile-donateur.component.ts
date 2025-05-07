import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { BeneficiaryService } from '../services/beneficiary/beneficiary.service';

@Component({
  selector: 'app-profile-donateur',
  standalone: false,
  templateUrl: './profile-donateur.component.html',
  styleUrl: './profile-donateur.component.css'
})
export class ProfileDonateurComponent {
onPhotoSelected($event: Event) {
throw new Error('Method not implemented.');
}
resetForm() {
throw new Error('Method not implemented.');
}
 utilisateur: any = {};
  profileForm!: FormGroup;

  gouvernorats: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
    'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  isEditing: { [key: string]: boolean } = {
    name: false,
    lastname: false,
    email: false,
    phoneNumber: false,
    gouvernorat: false,
    Age: false,
    address: false
  };

  constructor(
    private authService: AuthService,
    private beneficiaryService: BeneficiaryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBeneficiaryData();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: [''],
      lastname: [''],
      email: [''],
      phoneNumber: [''],
      gouvernorat: [''],
      Age: [''],
      address: ['']
    });
  }

  loadBeneficiaryData(): void {
    const id = this.authService.getCurrentUserId();
    if (!id) {
      console.error('No user ID found');
      return;
    }

    this.beneficiaryService.getBeneficiaireById(id).subscribe({
      next: (data: { data: { beneficiary: any } }) => {
        const beneficiary = data.data.beneficiary;
        this.utilisateur = beneficiary;
        this.profileForm.patchValue({
          name: beneficiary.name || '',
          lastname: beneficiary.lastname || '',
          email: beneficiary.email || '',
          phoneNumber: beneficiary.phoneNumber || '',
          gouvernorat: beneficiary.gouvernorat || '',
          Age: beneficiary.Age || '',
          address: beneficiary.address || ''
        });
      },
      error: (err: any) => {
        console.error('Error loading beneficiary data:', err);
      }
    });
  }

  modifierChamp(champ: string): void {
    this.isEditing[champ] = true;
  }

  saveField(champ: string): void {
    const id = this.authService.getCurrentUserId();
    const value = this.profileForm.get(champ)?.value;

    if (!id || value === undefined) return;

    this.beneficiaryService.updateBeneficiaire(id, { [champ]: value }).subscribe({
      next: () => {
        this.utilisateur[champ] = value;
        this.isEditing[champ] = false;
      },
      error: (err: any) => {
        console.error(`Error updating ${champ}:`, err);
      }
    });
  }

}
