import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ajouter-des-documents-beneficiaire',
  standalone: false,
  templateUrl: './ajouter-des-documents-beneficiaire.component.html',
  styleUrl: './ajouter-des-documents-beneficiaire.component.css'
})
export class AjouterDesDocumentsBeneficiaireComponent {
    documentForm: FormGroup;
    personalPhotoPreview: string | ArrayBuffer | null = null;
    housePhotoPreview: string | ArrayBuffer | null = null;
    bulletinPreview: string = '';

    constructor(private fb: FormBuilder) {
      this.documentForm = this.fb.group({
        personalPhoto: [null, Validators.required],
        housePhoto: [null, Validators.required],
        bulletin: [null, Validators.required]
      });
    }

    onFileChange(event: any, field: string): void {
      const file = event.target.files[0];
      if (file) {
        if (field === 'personalPhoto' || field === 'housePhoto') {
          const reader = new FileReader();
          reader.onload = () => {
            if (field === 'personalPhoto') {
              this.personalPhotoPreview = reader.result;
            } else {
              this.housePhotoPreview = reader.result;
            }
          };
          reader.readAsDataURL(file);
        } else if (field === 'bulletin') {
          this.bulletinPreview = file.name;
        }
      }
    }

    onSubmit(): void {
      if (this.documentForm.valid) {
        console.log('Form submitted!', this.documentForm.value);
      }
    }
  }

