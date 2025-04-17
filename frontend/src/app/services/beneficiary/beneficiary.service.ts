import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  private apiUrl = 'http://localhost:5000/api/beneficiaries'; 

  constructor(private http : HttpClient) { }

  createBeneficiaire(beneficiaireData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, beneficiaireData);
  }

  getBeneficiaires(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }

  getBeneficiaireById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  updateBeneficiaire(id: string, beneficiaireData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${id}`, beneficiaireData);
  }

  deleteBeneficiaire(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
