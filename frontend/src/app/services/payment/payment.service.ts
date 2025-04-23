import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:5000/api/payment'; 

  constructor(private http : HttpClient) { }

  makePayment(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payment`, paymentData);
  }

  verifyPayment(paymentId: string, formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify/${paymentId}`, formData);
  }

}
