import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VolunteerService } from '../services/volunteer/volunteer.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-profil-benevole',
  standalone: false,
  templateUrl: './profil-benevole.component.html',
  styleUrl: './profil-benevole.component.css'
})
export class ProfilBenevoleComponent {

  profileForm!: FormGroup;
  isEditing: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadInProgress: boolean = false;
  updateInProgress: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';
  volunteerData: any = null;

  gouvernorats: string[] = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès',
    'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili',
    'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  constructor(
    private fb: FormBuilder,
    private volunteerService: VolunteerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadVolunteerData();
  }

  loadVolunteerData(): void {
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.volunteerService.getVolunteerById(userId).subscribe({
      next: (response) => {
        this.volunteerData = response.data?.volunteer;
        this.initializeForm();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading volunteer data:', err);
        this.errorMessage = 'Failed to load volunteer data';
        this.isLoading = false;
      }
    });
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: [this.volunteerData?.name || ''],
      lastName: [this.volunteerData?.lastName || ''],
      email: [this.volunteerData?.email || ''],
      phone: [this.volunteerData?.phone || ''],
      gouvernorat: [this.volunteerData?.gouvernorat || ''],
      address: [this.volunteerData?.address || ''],
      age: [this.volunteerData?.age || '']
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.initializeForm(); // Reset form if canceling edit
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPhoto(): void {
    if (!this.selectedFile || !this.volunteerData?._id) return;
  
    this.uploadInProgress = true;
    this.errorMessage = '';
  
    this.volunteerService.uploadPhoto(this.volunteerData._id, this.selectedFile)
      .subscribe({
        next: (response: any) => {
          this.uploadInProgress = false;
          
          if (response.success && response.data?.photoUrl) {
            this.volunteerData.photoUrl = response.data.photoUrl;
            this.previewUrl = null;
            this.selectedFile = null;
          } else {
            this.errorMessage = response.message || 'Photo upload completed but no URL received';
          }
        },
        error: (err) => {
          this.uploadInProgress = false;
          console.error('Upload error:', err);
          
          if (err.status === 0) {
            this.errorMessage = 'Server connection failed. Please check your network.';
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Photo upload failed. Please try again.';
          }
        }
      });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.volunteerData?._id) {
      this.updateInProgress = true;
      const updatedData = this.profileForm.value;
      
      this.volunteerService.updateVolunteer(this.volunteerData._id, updatedData)
        .subscribe({
          next: (response) => {
            this.volunteerData = { ...this.volunteerData, ...updatedData };
            this.isEditing = false;
            this.updateInProgress = false;
          },
          error: (err) => {
            console.error('Error updating profile:', err);
            this.updateInProgress = false;
          }
        });
    }
  }
  }



