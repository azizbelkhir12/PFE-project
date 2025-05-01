import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = `${environment.apiUrl}/api/messages`;

  constructor(private http: HttpClient) {}

  sendMessage(message: any) {
    return this.http.post(this.baseUrl, message);
  }

  getConversation(user1Id: string, user2Id: string) {
    return this.http.get(`${this.baseUrl}/${user1Id}/${user2Id}`);
  }
}
