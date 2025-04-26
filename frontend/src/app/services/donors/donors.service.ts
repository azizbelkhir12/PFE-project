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

  createDonation(donation: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createDonation`, donation);
  }
}
