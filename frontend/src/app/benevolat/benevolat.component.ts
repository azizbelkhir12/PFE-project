import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { PatternValidatorsService } from '../services/patternValidators/patern-validators.service';
import { ConfirmPasswordService } from '../services/confirm-password/confirm-password.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from '../services/demande/demande.service';


@Component({
  selector: 'app-benevolat',
  standalone: false,
  templateUrl: './benevolat.component.html',
  styleUrl: './benevolat.component.css'
})
export class BenevolatComponent {

  title: string = 'Up';
  titleS: string = 'Sign';
  errorMsg: string = "";
  path: string = "";
  user: any;
  isLoading: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private demandeService : DemandeService) { }

  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      PatternValidatorsService.patternValidators(/\d/, { hasNumber: true }),
      PatternValidatorsService.patternValidators(/[A-Z]/, { hasCapitalCase: true }),
      PatternValidatorsService.patternValidators(/[a-z]/, { hasSmallCase: true }),
      PatternValidatorsService.patternValidators(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/, { hasSpecialCharacters: true }),
      Validators.minLength(8),
      Validators.maxLength(20)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
      Validators.pattern(/^(?!\s+$).*$/)
    ]),
    gouvernorat: new FormControl('', [
      Validators.required,
      //Validators.pattern(/^\d{4}$/)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+216\d{8}$/)
    ]),
    reason: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]), 
    
  }, { validators: ConfirmPasswordService.matchingPassword() });

  gouvernorats: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
    'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba', 'Medenine', 'Monastir', 'Nabeul',
    'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  ngOnInit() {
    this.path = this.router.url;
  }
  

  // Function to set the active tab
 
  submit() {
    // Mark all fields as touched to show validation messages
    this.signupForm.markAllAsTouched();
  
    // Debug: Log form status and errors
    console.log('Form status:', this.signupForm.status);
    console.log('Form errors:', this.signupForm.errors);
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      console.log(`${key} valid: ${control?.valid}, errors: ${control?.errors}`);
    });
  
    if (this.signupForm.invalid) {
      this.errorMsg = 'Veuillez remplir tous les champs correctement';
      console.error('Form invalid. Details above.');
      return;
    }
  
    const formData = { ...this.signupForm.value };
    delete formData.confirmPassword;
  
    this.isLoading = true;
    this.errorMsg = '';
  
    this.demandeService.Demande(formData).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        this.isLoading = false;
        this.signupForm.reset();
        alert('Inscription réussie !');
      },
      error: (error) => {
        console.error('Erreur lors de linscription', error);
        this.isLoading = false;
        this.errorMsg = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
        alert(this.errorMsg);
      }
    });
  }
  }