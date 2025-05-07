import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonnementService {

  private apiUrl = 'http://localhost:5000/api/abonnement'; 
  constructor(private http : HttpClient) { }

  initiatePayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/abonnement`, paymentData);
  }

  verifyPayment(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify/${paymentId}`);
  }

  createAbonnement(abonnementData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createAbonnement`, abonnementData);
  }

  getAbonnementByVolunteer(volunteerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-volunteer/${volunteerId}`);
  }
  
}
