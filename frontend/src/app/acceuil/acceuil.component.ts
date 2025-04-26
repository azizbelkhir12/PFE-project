import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../services/contact/contact.service';
//import { ScriptsService } from '../services/scripts.service';

@Component({
  selector: 'app-acceuil',
  standalone: false,
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent {
  scriptsService: any;
  successMessage: string = '';
  activeTab: string = 'about';

  services = [
    { icon: 'flaticon-diet', title: ' Soutien à lÉducation des Enfants ', description: 'Fournir des fournitures scolaires et du soutien aux enfants orphelins.' },
    { icon: 'flaticon-water', title: 'Eau Pure', description: 'Assurer l\'accès à de l\'eau potable propre et sûre.' }
,   { icon: 'flaticon-orphelinat', title: 'Parrainage d\'Enfants', description: 'Trouver des parrains pour soutenir les enfants dans le besoin.' },

{ icon: 'flaticon-poverty', title: 'Lutte contre la pauvreté', description: 'Soutien aux familles précaires avec aide matérielle, éducative et sociale.' }
,{ icon: 'flaticon-emergency', title: 'Urgence humanitaire', description: 'Assistance immédiate aux victimes de crises avec aide alimentaire, abris et soins.' }
,{ icon: 'flaticon-social-care', title: 'Aide Sociale', description: 'Aider les personnes en situation difficile.' }

  ];

  facts = [
    { icon: 'flaticon-home', value: 150, text: 'Countries' },
    { icon: 'flaticon-charity', value: 400, text: 'Volunteers' },
    { icon: 'flaticon-kindness', value: 10000, text: 'Our Goal', prefix: `$` },
    { icon: 'flaticon-donation', value: 5000, text: 'Raised', prefix: `$` }
  ];

  causes = [
    {
      img: 'assets/img/causes-1.jpg',
      title: 'Food for the Hungry',
      description: 'Providing food to those in need across the globe.',
      raised: 100000,
      goal: 50000,
      progress: 85
    },
    {
      img: 'assets/img/causes-2.jpg',
      title: 'Clean Water Initiative',
      description: 'Helping communities gain access to clean water.',
      raised: 80000,
      goal: 60000,
      progress: 75
    },
    {
      img: 'assets/img/causes-3.jpg',
      title: 'Education for All',
      description: 'Providing education to underprivileged children.',
      raised: 120000,
      goal: 100000,
      progress: 90
    },
    {
      img: 'assets/img/causes-4.jpg',
      title: 'Disaster Relief',
      description: 'Helping victims recover from natural disasters.',
      raised: 50000,
      goal: 75000,
      progress: 60
    }
  ];

  donateForm: FormGroup;
  contactForm: FormGroup;
  donationAmounts = [10, 20, 30];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private http: HttpClient
  ) {
    this.donateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      amount: [this.donationAmounts[0], Validators.required]
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.scriptsService.initializeScripts();
  }

  ngAfterViewInit() {
    this.animateNumbers();
  }

  animateNumbers() {
    this.facts.forEach((fact, index) => {
      let start = 0;
      const end = fact.value;
      const duration = 2000; // Animation en 2 secondes
      const stepTime = Math.abs(Math.floor(duration / end));

      const timer = setInterval(() => {
        if (start < end) {
          start += Math.ceil(end / 100); // Incrémentation progressive
          this.facts[index].value = start;
        } else {
          this.facts[index].value = end; // S'assurer que la valeur finale est correcte
          clearInterval(timer);
        }
      }, stepTime);
    });
  }

  onSubmitForm() {
    if (this.contactForm.valid) {
      this.contactService.submitContactForm(this.contactForm.value).subscribe({
        next: (response: { message: string }) => {
          this.successMessage = response.message;
          this.contactForm.reset();
        },
        error: (error: any) => {
          console.error('Error submitting form:', error);
        }
      });
    }
  }
}
