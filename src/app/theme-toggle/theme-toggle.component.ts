import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="theme-toggle" 
            (click)="toggleTheme($event)" 
            [title]="getTooltip()" 
            [class.dark]="currentTheme === 'dark'"
            type="button"
            aria-label="Toggle theme">
      <span class="theme-icon">{{ currentTheme === 'light' ? '🌙' : '☀️' }}</span>
    </button>
  `,
  styles: [`
    .theme-toggle {
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 1001;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      color: white;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    .theme-toggle.dark {
      background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }
    
    .theme-icon {
      transition: all 0.3s ease;
      display: inline-block;
    }

    .theme-toggle:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
    
    .theme-toggle.dark:hover {
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    }
    
    .theme-toggle:active {
      transform: scale(0.95);
    }
    
    .theme-toggle:hover .theme-icon {
      transform: rotate(-15deg) scale(1.1);
    }

    @media (max-width: 768px) {
      .theme-toggle {
        top: 80px;
        right: 15px;
        width: 45px;
        height: 45px;
        font-size: 18px;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  currentTheme = 'light';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(event?: Event) {
    // Prevent default behavior and event bubbling
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Enhanced mobile detection and handling
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                       window.innerWidth <= 768;
      
      if (isMobile) {
        // Add haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        
        // Ensure the button doesn't get stuck in active state
        const target = event.target as HTMLElement;
        if (target) {
          target.blur();
          // Force visual feedback
          target.style.transform = 'scale(0.9)';
          setTimeout(() => {
            target.style.transform = '';
          }, 150);
        }
        
        // Debug logging for mobile
        console.log('Mobile theme toggle activated');
      }
    }
    
    try {
      this.themeService.toggleTheme();
    } catch (error) {
      console.error('Error toggling theme:', error);
      // Fallback: still try to toggle theme
      try {
        this.themeService.toggleTheme();
      } catch (fallbackError) {
        console.error('Fallback theme toggle also failed:', fallbackError);
      }
    }
  }
  
  getTooltip(): string {
    return this.currentTheme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro';
  }
}