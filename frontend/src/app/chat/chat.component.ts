import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../services/socket/socket.service';
import { MessageService } from '../services/message/message.service';
import { VolunteerService } from '../services/volunteer/volunteer.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  messages: any[] = [];
  newMessage = '';

  senderId = '680aa169a707348ab78f8282';
  senderRole = 'admin';

  receiverId = '';
  receiverRole = 'volunteer';
  selectedVolunteerName = '';

  volunteers: any[] = [];
  filteredVolunteers: any[] = [];
  volunteerSearch = '';

  constructor(
    private socketService: SocketService,
    private messageService: MessageService,
    private volunteerService: VolunteerService
  ) {}

  ngOnInit(): void {
    this.socketService.joinRoom(this.senderId);
    this.getVolunteers();

    this.socketService.onReceiveMessage().subscribe((msg: any) => {
      this.messages.push(msg);
    });
  }

 
    sendMessage() {
      if (!this.newMessage.trim() || !this.receiverId) return;
    
      const message = {
        senderId: this.senderId,
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

  getVolunteers() {
    this.volunteerService.getVolunteers().subscribe((data: any[]) => {
      this.volunteers = data;
      this.filteredVolunteers = data;
    });
  }

  filterVolunteers() {
    const search = this.volunteerSearch.toLowerCase();
    this.filteredVolunteers = this.volunteers.filter(v =>
      v.name.toLowerCase().includes(search)
    );
  }

  onVolunteerSelect(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    const selectedVolunteer = this.volunteers.find(v => v._id === selectedId);

    if (selectedVolunteer) {
      this.receiverId = selectedVolunteer._id;
      this.selectedVolunteerName = selectedVolunteer.name;

      this.messageService.getConversation(this.senderId, this.receiverId).subscribe((res: any) => {
        this.messages = res;
      });
    }
  }
}
