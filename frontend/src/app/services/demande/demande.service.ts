import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private apiUrl = 'http://localhost:5000/api/demande/demande'

  constructor( private http : HttpClient) { }

  Demande(formData: FormData) {
    return this.http.post(this.apiUrl, formData);
  }

}
