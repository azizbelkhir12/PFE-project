import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {

  private apiUrl = 'http://localhost:5000/api/volunteers';

  constructor(private http : HttpClient) { }

  getVolunteers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/volunteers`);
  }
}
