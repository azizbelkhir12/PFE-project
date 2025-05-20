import { Component,  HostListener  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-language-switcher',
  standalone: false,
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent {
   currentLang: string;
  showText = true;
  isOpen = false;

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang || translate.getDefaultLang();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent event bubbling
    this.isOpen = !this.isOpen;
  }

  switchLanguage(lang: string, event: Event) {
    event.stopPropagation();
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('userLanguage', lang);
    this.isOpen = false; // Close dropdown after selection
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isOpen = false;
    }
  }
}


