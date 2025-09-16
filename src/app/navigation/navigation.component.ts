import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';
import { ThemeService } from '../theme.service';
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
  isThemeDropdownOpen = false;
  private isMobile = false;
  private touchStartTime = 0;
  isDraggingMenu = false;
  dragStartX = 0;
  menuTranslateX = 0;
  availableThemes = [
    { code: 'light', name: 'Claro', icon: '☀️' },
    { code: 'dark', name: 'Escuro', icon: '🌙' }
  ];
  currentTheme = 'light';
  
  // Menu drag
  isDragging = false;
  startX = 0;
  translateX = 0;
  


  constructor(
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.initializeLanguageSettings();
    this.initializeThemeSettings();
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
      
      // Close theme dropdown if clicking outside
      if (!target.closest('.mobile-theme-selector')) {
        if (this.isThemeDropdownOpen) {
          this.isThemeDropdownOpen = false;
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
    if (this.isThemeDropdownOpen) {
      this.isThemeDropdownOpen = false;
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
  
  private initializeThemeSettings() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
      this.cdr.detectChanges();
    });
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
    console.log('Navigate clicked:', section);
    
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.closeMenu();
    
    setTimeout(() => {
      switch (section) {
        case 'profile':
          this.router.navigate(['/profile']);
          break;
        case 'settings':
          this.router.navigate(['/settings']);
          break;
        case 'reports':
          this.router.navigate(['/reports']);
          break;
        case 'help':
          this.router.navigate(['/help']);
          break;
        case 'delete-account':
          this.router.navigate(['/delete-account']);
          break;
      }
    }, 100);
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
  
  toggleThemeDropdown(event?: Event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
      
      // Close other dropdowns
      if (this.isThemeDropdownOpen) {
        this.isLanguageDropdownOpen = false;
        this.isUserMenuOpen = false;
      }
      
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error toggling theme dropdown:', error);
      this.isThemeDropdownOpen = false;
    }
  }
  
  selectTheme(themeCode: string, event?: Event) {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.themeService.setTheme(themeCode);
      this.isThemeDropdownOpen = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error selecting theme:', error);
      this.isThemeDropdownOpen = false;
    }
  }
  
  getCurrentThemeName(): string {
    const currentThemeObj = this.availableThemes.find(theme => theme.code === this.currentTheme);
    return currentThemeObj ? currentThemeObj.name : 'Claro';
  }
  
  getCurrentThemeIcon(): string {
    const currentThemeObj = this.availableThemes.find(theme => theme.code === this.currentTheme);
    return currentThemeObj ? currentThemeObj.icon : '☀️';
  }
  
  onDragStart(e: any) {
    this.isDragging = true;
    this.startX = e.touches ? e.touches[0].clientX : e.clientX;
    this.translateX = 0;
    
    document.addEventListener('mousemove', this.onDragMove.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
    document.addEventListener('touchmove', this.onDragMove.bind(this));
    document.addEventListener('touchend', this.onDragEnd.bind(this));
    
    e.preventDefault();
  }
  
  onDragMove(e: any) {
    if (!this.isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - this.startX;
    if (deltaX > 0) this.translateX = deltaX;
    e.preventDefault();
  }
  
  onDragEnd() {
    this.isDragging = false;
    
    document.removeEventListener('mousemove', this.onDragMove.bind(this));
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
    document.removeEventListener('touchmove', this.onDragMove.bind(this));
    document.removeEventListener('touchend', this.onDragEnd.bind(this));
    
    if (this.translateX > 100) this.closeMenu();
    this.translateX = 0;
  }
  
  getMenuTransform() {
    return `translateX(${this.translateX}px)`;
  }
  
  // Menu drag functionality
  onMenuDragStart(event: MouseEvent | TouchEvent) {
    this.isDraggingMenu = true;
    this.dragStartX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.menuTranslateX = 0;
    
    document.addEventListener('mousemove', this.onMenuDragMove.bind(this));
    document.addEventListener('mouseup', this.onMenuDragEnd.bind(this));
    document.addEventListener('touchmove', this.onMenuDragMove.bind(this));
    document.addEventListener('touchend', this.onMenuDragEnd.bind(this));
    
    event.preventDefault();
  }
  
  onMenuDragMove(event: MouseEvent | TouchEvent) {
    if (!this.isDraggingMenu) return;
    
    const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const deltaX = currentX - this.dragStartX;
    
    // Only allow dragging to the right (positive deltaX)
    if (deltaX > 0) {
      this.menuTranslateX = deltaX;
    }
    
    event.preventDefault();
  }
  
  onMenuDragEnd(event: MouseEvent | TouchEvent) {
    if (!this.isDraggingMenu) return;
    
    this.isDraggingMenu = false;
    
    document.removeEventListener('mousemove', this.onMenuDragMove.bind(this));
    document.removeEventListener('mouseup', this.onMenuDragEnd.bind(this));
    document.removeEventListener('touchmove', this.onMenuDragMove.bind(this));
    document.removeEventListener('touchend', this.onMenuDragEnd.bind(this));
    
    // Close menu if dragged more than 100px to the right
    if (this.menuTranslateX > 100) {
      this.closeMenu();
    }
    
    // Reset transform
    this.menuTranslateX = 0;
  }
  
  getMenuStyle() {
    return {
      'transform': this.isDraggingMenu ? `translateX(${this.menuTranslateX}px)` : 'translateX(0)',
      'transition': this.isDraggingMenu ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  }
}
