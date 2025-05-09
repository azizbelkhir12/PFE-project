import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DonorsService {

  private apiUrl = 'http://localhost:5000/api/donors'; 
  private baseUrl = 'http://localhost:5000/api/donations';
  constructor(private http : HttpClient) { }

  getDonors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/donors`);
  }
 
  getDonorsById(id: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/donors/${id}`);
  }

  updateDonor(id: string, donor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, donor);
  }

  createDonation(donation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createDonation`, donation);
  }

  Payment(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment`, paymentData);
  }

  verifyPayment(paymentId: string, formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verifyPayment/${paymentId}`, formData);
  }

  getDonationsByDonorId(donorId: string): Observable<{success: boolean, donations: any[]}> {
    return this.http.get<{success: boolean, donations: any[]}>(`${this.apiUrl}/donations/${donorId}`);
  }

  assignBeneficiaryToDonor(donorId: string, beneficiaryId: string) {
    const body = { donorId, beneficiaryId };
    return this.http.post(`${this.apiUrl}/assign-beneficiary`, body);
  }

  getDonorWithBeneficiaries(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/with-beneficiaries/${id}`);
}


}
