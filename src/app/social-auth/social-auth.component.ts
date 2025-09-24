import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-auth',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="social-auth-container">
      <div class="divider">
        <span>{{ mode === 'login' ? 'ou faça login com' : 'ou cadastre-se com' }}</span>
      </div>
      
      <div class="social-buttons">
        <button 
          type="button" 
          class="social-btn google-btn" 
          [class.loading]="isLoading"
          (click)="signInWithGoogle()"
          [disabled]="isLoading">
          <svg class="social-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <button 
          type="button" 
          class="social-btn facebook-btn" 
          [class.loading]="isLoading"
          (click)="signInWithFacebook()"
          [disabled]="isLoading">
          <svg class="social-icon" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>


      </div>
    </div>
  `,
  styles: [`
    .social-auth-container {
      margin: 20px 0;
    }

    .divider {
      text-align: center;
      margin: 20px 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e0e0e0;
      z-index: 1;
    }

    .divider span {
      background: white;
      padding: 0 15px;
      color: #666;
      font-size: 14px;
      position: relative;
      z-index: 2;
    }

    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      color: #333;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }

    .social-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .social-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .social-icon {
      width: 20px;
      height: 20px;
    }

    .google-btn:hover:not(:disabled) {
      border-color: #4285F4;
    }

    .facebook-btn:hover:not(:disabled) {
      border-color: #1877F2;
    }

    .linkedin-btn:hover:not(:disabled) {
      border-color: #0A66C2;
    }

    @media (max-width: 768px) {
      .social-buttons {
        gap: 10px;
      }
      
      .social-btn {
        padding: 10px 14px;
        font-size: 13px;
      }
    }
  `]
})
export class SocialAuthComponent {
  @Input() mode: 'login' | 'register' = 'login';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async signInWithGoogle() {
    this.isLoading = true;
    try {
      await this.authService.signInWithSocialProvider('google');
    } catch (error) {
      console.error('Google sign in error:', error);
      alert('Erro ao fazer login com Google. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithFacebook() {
    this.isLoading = true;
    try {
      await this.authService.signInWithSocialProvider('facebook');
    } catch (error) {
      console.error('Facebook sign in error:', error);
      alert('Erro ao fazer login com Facebook. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }


}