import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: [AuthService],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  currentLanguage = 'pt';
  availableLanguages: { code: string; name: string }[] = [];
  isLanguageDropdownOpen = false;
  isUserMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.initializeLanguageSettings();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-dropdown')) {
        this.isUserMenuOpen = false;
      }
      if (!target.closest('.language-selector')) {
        this.isLanguageDropdownOpen = false;
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.updateBodyScroll();
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.updateBodyScroll();
  }

  private updateBodyScroll() {
    if (this.isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.isLoggedIn = false;
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  private checkAuthStatus() {
    // Check initial state from localStorage
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        this.isLoggedIn = user.isAuthenticated === true;
        console.log('Initial auth state from localStorage:', this.isLoggedIn);
      } catch (error) {
        this.isLoggedIn = false;
      }
    }
    
    // Subscribe to auth state changes
    this.authService.isAuthenticated().subscribe(isAuth => {
      console.log('Auth status changed from', this.isLoggedIn, 'to', isAuth);
      this.isLoggedIn = isAuth;
      this.cdr.detectChanges(); // Force change detection
    });
    
    // Also check periodically (temporary debug)
    setInterval(() => {
      const currentAuthUser = localStorage.getItem('auth_user');
      if (currentAuthUser) {
        try {
          const user = JSON.parse(currentAuthUser);
          const shouldBeLoggedIn = user.isAuthenticated === true;
          if (shouldBeLoggedIn !== this.isLoggedIn) {
            console.log('Auth state mismatch detected, updating...');
            this.isLoggedIn = shouldBeLoggedIn;
            this.cdr.detectChanges();
          }
        } catch (error) {
          // ignore
        }
      }
    }, 1000);
  }

  private initializeLanguageSettings() {
    this.availableLanguages = this.translationService.getAvailableLanguages();
    this.currentLanguage = this.translationService.getCurrentLanguage();
  }

  changeLanguage(language: string) {
    this.translationService.setLanguage(language);
    this.currentLanguage = language;
    this.closeMenu(); // Close menu on language change for better UX on mobile
  }

  toggleLanguageDropdown() {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
  }

  getCurrentLanguageName(): string {
    const currentLang = this.availableLanguages.find(lang => lang.code === this.currentLanguage);
    return currentLang ? currentLang.name : 'Português';
  }

  selectLanguage(languageCode: string) {
    this.changeLanguage(languageCode);
    this.isLanguageDropdownOpen = false;
  }
  
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    // Close language dropdown if open
    if (this.isUserMenuOpen) {
      this.isLanguageDropdownOpen = false;
    }
  }
  
  navigateToSection(section: string) {
    this.isUserMenuOpen = false;
    
    if (section === 'help' && !this.isLoggedIn) {
      // For non-logged users, navigate to a help page or show help modal
      this.router.navigate(['/help']);
      return;
    }
    
    if (this.isLoggedIn) {
      // Navigate to dashboard and trigger section
      this.router.navigate(['/dashboard']).then(() => {
        // Emit event to dashboard to show specific section
        window.dispatchEvent(new CustomEvent('navigate-to-section', { 
          detail: { section } 
        }));
      });
    } else {
      // Redirect to login for protected sections
      if (['profile', 'settings', 'reports'].includes(section)) {
        this.router.navigate(['/login']);
      }
    }
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}
