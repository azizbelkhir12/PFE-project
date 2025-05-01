import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      withCredentials: true,
      autoConnect: false
    });
  }

  connect(userId: string) {
    this.socket.auth = { userId };
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message: any) {
    this.socket.emit('sendMessage', message);
  }

  onReceiveMessage() {
    return new Observable<any>(observer => {
      this.socket.on('receiveMessage', (data) => observer.next(data));
    });
  }

  joinRoom(userId: string) {
    this.socket.emit('join', userId);
  }
}
