import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { ScriptsService } from '../services/scripts.service';
;

@Component({
  selector: 'app-acceuil',
  standalone: false,
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent {
  scriptsService: any;

  ngOnInit() {  
    this.scriptsService.initializeScripts();
  }
  successMessage: string = '';
  slides = [
    {
      image: 'assets/children.png',
      title: "Let's be kind for children",
      description: "Lorem ipsum dolor sit amet elit. Phasellus ut mollis mauris. Vivamus egestas eleifend dui ac consequat at lectus in malesuada"
    },
    {
      image: 'assets/img/carousel-2.jpg',
      title: "Get Involved with helping hand",
      description: "Morbi sagittis turpis id suscipit feugiat. Suspendisse eu augue urna. Morbi sagittis, orci sodales varius fermentum, tortor"
    },
    {
      image: 'assets/img/carousel-3.jpg',
      title: "Bringing smiles to millions",
      description: "Sed ultrices, est eget feugiat accumsan, dui nibh egestas tortor, ut rhoncus nibh ligula euismod quam. Proin pellentesque odio"
    }
  ];

  activeTab: string = 'about';

  services = [
    { icon: 'flaticon-diet', title: 'Healthy Food', description: 'Providing nutritious food for those in need.' },
    { icon: 'flaticon-water', title: 'Pure Water', description: 'Ensuring access to clean and safe drinking water.' },
    { icon: 'flaticon-healthcare', title: 'Health Care', description: 'Offering medical assistance to improve well-being.' },
    { icon: 'flaticon-education', title: 'Primary Education', description: 'Supporting education for underprivileged children.' },
    { icon: 'flaticon-home', title: 'Residence Facilities', description: 'Providing shelter for those without homes.' },
    { icon: 'flaticon-social-care', title: 'Social Care', description: 'Helping individuals in difficult situations.' }
  ];


  facts = [
    { icon: 'flaticon-home', value: 150, text: 'Countries' },
    { icon: 'flaticon-charity', value: 400, text: 'Volunteers' },
    { icon: 'flaticon-kindness', value: 10000, text: 'Our Goal', prefix: `$`},
    { icon: 'flaticon-donation', value: 5000, text: 'Raised', prefix: `$` }
  ];

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
  constructor(private fb: FormBuilder) {
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

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Contact Data:', this.contactForm.value);
      this.successMessage = `Thank you, ${this.contactForm.value.name}! Your message has been sent.`;
      this.contactForm.reset();
      setTimeout(() => (this.successMessage = ''), 5000); // Cache le message après 5 sec
    }
  }

  currentYear: number = new Date().getFullYear();

  

  

}
