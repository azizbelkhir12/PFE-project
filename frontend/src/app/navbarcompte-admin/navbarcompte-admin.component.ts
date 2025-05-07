import { Component } from '@angular/core';
import {
  faAlignJustify,
  faEnvelope,
  faAngleDown,
  faSlidersH,
  faRightFromBracket,
  faCirclePlus,
  faUserShield,
  faBell, faMessage
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth/auth.service';
import { SocketService } from '../services/socket/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbarcompte-admin',
  templateUrl: './navbarcompte-admin.component.html',
  standalone: false,
  styleUrls: ['./navbarcompte-admin.component.css'],
})
export class NavbarcompteAdminComponent {
  // Font Awesome Icons
  faAlignJustify = faAlignJustify;
  faUserShield = faUserShield;
  faEnvelope = faEnvelope;
  faAngleDown = faAngleDown;
  faSlidersH = faSlidersH;
  faRightFromBracket = faRightFromBracket;
  faBell = faBell;

  // Component State
  isProfileMenuOpen = false;
  unreadCount = 0;

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupMessageNotifications();
  }

  private setupMessageNotifications(): void {
    this.socketService.onReceiveMessage().subscribe((message: any) => {
      if (message.receiverRole === 'admin') {
        this.unreadCount++;
        this.playNotificationSound();
      }
    });
  }

  private playNotificationSound(): void {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(e => console.error('Notification sound error:', e));
  }

  viewMessages(): void {
    this.unreadCount = 0;
    this.router.navigate(['/admin-compte/chat']);
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  onDocumentClick(): void {
    this.isProfileMenuOpen = false;
  }

  toggleSidebar(): void {
    // Implement your sidebar toggle logic here
    console.log('Sidebar toggle clicked');
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login-admin']);
    });
  }
}