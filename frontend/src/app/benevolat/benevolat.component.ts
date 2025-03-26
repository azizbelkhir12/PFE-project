import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { PatternValidatorsService } from '../services/patternValidators/patern-validators.service';
import { ConfirmPasswordService } from '../services/confirm-password/confirm-password.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

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
    adress: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
      Validators.pattern(/^(?!\s+$).*$/)
    ]),
    zipCode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}$/)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+216\d{8}$/)
    ]),
    img: new FormControl(''),
  }, { validators: ConfirmPasswordService.matchingPassword() });

  ngOnInit() {
    this.path = this.router.url;
  }

  // Function to set the active tab
 

  onImageSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.signupForm.patchValue({ img: file });
      this.signupForm.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.signupForm.get('img')?.setErrors({ required: true });
    }
  }

  /*submit() {
    if (this.signupForm.valid) {
      console.log('Form submitted:', this.signupForm.value);
      this.signupForm.value.role = (this.path == "/signup") ? "user" : "admin";

      this.userService.signup(this.signupForm.value, this.signupForm.value.img).subscribe(
        (res) => {
          console.log("Here response after signup", res);
          if (res.msg) {
            this.router.navigate(['login']);
          } else {
            this.errorMsg = "Email already exists";
          }
        }
      );
    } else {
      console.log('Form invalid:', this.signupForm.errors);
    }
  }*/

}
