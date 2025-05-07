import { Component } from '@angular/core';
import { SocketService } from '../services/socket/socket.service';
import { MessageService } from '../services/message/message.service';
import { AuthService } from '../services/auth/auth.service';


@Component({
  selector: 'app-chat-admin',
  standalone: false,
  templateUrl: './chat-admin.component.html',
  styleUrl: './chat-admin.component.css'
})
export class ChatAdminComponent {
  messages: any[] = [];
    newMessage = '';
  
    senderId: string | null = null;
    senderRole = 'volunteer';  
  
    receiverId = '680aa169a707348ab78f8282';
    receiverRole = 'admin';
    selectedVolunteerName = '';
  
    volunteers: any[] = [];
    filteredVolunteers: any[] = [];
    volunteerSearch = '';
  
    constructor(
      private socketService: SocketService,
      private messageService: MessageService,
      private authService: AuthService
    ) {}
  
    ngOnInit(): void {
      this.senderId = this.authService.getCurrentUserId();
      if (this.senderId) {
        this.socketService.connect(this.senderId);
        this.socketService.joinRoom(this.senderId);
        
        // Load conversation if receiverId is already set
        if (this.receiverId) {
          this.loadConversation();
        }
      } else {
        console.error('Sender ID is null and cannot join the room.');
      }
      
      this.socketService.onReceiveMessage().subscribe((msg: any) => {
        this.messages.push(msg);
      });
    }
  
   
      sendMessage() {
        if (!this.newMessage.trim() || !this.receiverId) return;
      
        const message = {
          senderId: this.authService.getCurrentUserId(), 
          senderRole: this.senderRole,
          receiverId: this.receiverId,
          receiverRole: this.receiverRole,
          text: this.newMessage
        };
      
        // Add message locally immediately
        this.messages.push(message);
      
        // Send via socket and API
        this.socketService.sendMessage(message);
        this.messageService.sendMessage(message).subscribe();
      
        this.newMessage = '';
      }
      
    ngOnDestroy(): void {
      this.socketService.disconnect();
    }
  
    
  
    filterVolunteers() {
      const search = this.volunteerSearch.toLowerCase();
      this.filteredVolunteers = this.volunteers.filter(v =>
        v.name.toLowerCase().includes(search)
      );
    }
  
    private loadConversation() {
      if (this.senderId && this.receiverId) {
        this.messageService.getConversation(this.senderId, this.receiverId)
          .subscribe({
            next: (res: any) => {
              this.messages = res;
            },
            error: (err) => {
              console.error('Error loading conversation:', err);
            }
          });
      }
    }
}
