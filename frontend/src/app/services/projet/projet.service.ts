import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private apiUrl = 'http://localhost:5000/api/projects';
  private imgurClientId = '8613856d5e58443'; // Your Imgur client ID

  constructor(private http: HttpClient) { }

  getProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getProject`);
  }

  addProject(project: any, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('titre', project.titre);
    formData.append('description', project.description);
    formData.append('dateDebut', project.dateDebut);
    formData.append('dateFin', project.dateFin);
    formData.append('montantSoutenu', project.montantSoutenu.toString());
    formData.append('statut', project.statut);
    if (image) {
      formData.append('image', image);
    }
    
    return this.http.post<any>(`${this.apiUrl}/saveprojets`, formData);
  }

  updateProject(id: string, project: any, image?: File): Observable<any> {
    const formData = new FormData();
    formData.append('titre', project.titre);
    formData.append('description', project.description);
    formData.append('dateDebut', project.dateDebut);
    formData.append('dateFin', project.dateFin);
    formData.append('montantSoutenu', project.montantSoutenu.toString());
    formData.append('statut', project.statut);
    if (image) {
      formData.append('image', image);
    }
    
    return this.http.put<any>(`${this.apiUrl}/modifyPorject/${id}`, formData);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteProject/${id}`);
  }

  // Updated image URL handler
  getImageUrl(imageData: string): string {
    if (!imageData) {
      return 'assets/default-image.jpg';
    }
    
    // Check if it's already a full URL (from Imgur)
    if (imageData.startsWith('http')) {
      return imageData;
    }
    
    // Fallback for base64 images if needed
    return `data:image/jpeg;base64,${imageData}`;
  }
}