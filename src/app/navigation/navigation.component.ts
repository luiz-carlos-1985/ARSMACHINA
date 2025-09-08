import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule, ThemeToggleComponent],
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
  private isMobile = false;
  private touchStartTime = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.initializeLanguageSettings();
    this.detectMobileDevice();
    this.setupEventListeners();
  }

  private detectMobileDevice() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768;
    
    // Listen for window resize to update mobile status
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  private setupEventListeners() {
    // Enhanced click outside handling for mobile
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Close user menu if clicking outside
      if (!target.closest('.user-menu-dropdown')) {
        if (this.isUserMenuOpen) {
          this.isUserMenuOpen = false;
          this.cdr.detectChanges();
        }
      }
      
      // Close language dropdown if clicking outside
      if (!target.closest('.language-selector')) {
        if (this.isLanguageDropdownOpen) {
          this.isLanguageDropdownOpen = false;
          this.cdr.detectChanges();
        }
      }
      
      // Close mobile menu if clicking on overlay
      if (target.classList.contains('mobile-menu-overlay') && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // Handle touch events for better mobile interaction
    if (this.isMobile) {
      document.addEventListener('touchstart', (event) => {
        this.touchStartTime = Date.now();
      }, { passive: true });
    }
  }

  // Listen for escape key to close menus
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
    if (this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
      this.cdr.detectChanges();
    }
    if (this.isLanguageDropdownOpen) {
      this.isLanguageDropdownOpen = false;
      this.cdr.detectChanges();
    }
  }

  toggleMenu() {
    console.log('toggleMenu called, current state:', this.isMenuOpen);
    this.isMenuOpen = !this.isMenuOpen;
    this.updateBodyScroll();
    this.cdr.detectChanges();
    console.log('Menu toggled to:', this.isMenuOpen);
    
    // Force focus for mobile accessibility
    if (this.isMobile && this.isMenuOpen) {
      setTimeout(() => {
        const firstMenuItem = document.querySelector('.mobile-nav-item') as HTMLElement;
        if (firstMenuItem) {
          firstMenuItem.focus();
        }
      }, 100);
    }
  }

  closeMenu() {
    console.log('closeMenu called');
    this.isMenuOpen = false;
    this.updateBodyScroll();
    this.cdr.detectChanges();
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

  toggleLanguageDropdown(event?: Event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
      
      // Close user menu if opening language dropdown
      if (this.isLanguageDropdownOpen) {
        this.isUserMenuOpen = false;
      }
      
      // Force change detection for mobile
      if (this.isMobile) {
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error toggling language dropdown:', error);
      this.isLanguageDropdownOpen = false;
    }
  }

  getCurrentLanguageName(): string {
    const currentLang = this.availableLanguages.find(lang => lang.code === this.currentLanguage);
    return currentLang ? currentLang.name : 'Português';
  }

  selectLanguage(languageCode: string, event?: Event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.changeLanguage(languageCode);
      this.isLanguageDropdownOpen = false;
      
      // Force change detection for mobile
      if (this.isMobile) {
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error selecting language:', error);
      this.isLanguageDropdownOpen = false;
    }
  }
  
  toggleUserMenu(event?: Event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.isUserMenuOpen = !this.isUserMenuOpen;
      
      // Close language dropdown if opening user menu
      if (this.isUserMenuOpen) {
        this.isLanguageDropdownOpen = false;
      }
      
      // Force change detection for mobile
      if (this.isMobile) {
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error toggling user menu:', error);
      this.isUserMenuOpen = false;
    }
  }
  
  navigateToSection(section: string, event?: Event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Close all menus
      this.isUserMenuOpen = false;
      this.closeMenu();
      
      // Navigate directly to the correct route
      switch (section) {
        case 'profile':
          if (this.isLoggedIn) {
            this.router.navigate(['/profile']);
          } else {
            this.router.navigate(['/login']);
          }
          break;
          
        case 'settings':
          if (this.isLoggedIn) {
            this.router.navigate(['/settings']);
          } else {
            this.router.navigate(['/login']);
          }
          break;
          
        case 'reports':
          if (this.isLoggedIn) {
            this.router.navigate(['/reports']);
          } else {
            this.router.navigate(['/login']);
          }
          break;
          
        case 'help':
          if (this.isLoggedIn) {
            this.router.navigate(['/help-dashboard']);
          } else {
            this.router.navigate(['/help']);
          }
          break;
          
        default:
          console.warn('Unknown section:', section);
          if (this.isLoggedIn) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/login']);
          }
      }
      
      // Force change detection for mobile
      if (this.isMobile) {
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error navigating to section:', error);
      // Ensure menus are closed even if navigation fails
      this.isUserMenuOpen = false;
      this.closeMenu();
    }
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}
