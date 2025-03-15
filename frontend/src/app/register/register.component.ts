import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  activeTab: string = 'tab-content-1'; // Default active tab

  // Function to change the active tab
  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }
}
