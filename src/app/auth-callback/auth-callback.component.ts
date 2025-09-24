import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-content">
        <div class="loading-spinner"></div>
        <h2>Processando autenticação...</h2>
        <p>Aguarde enquanto finalizamos seu login.</p>
        
        <div *ngIf="error" class="error-message">
          <h3>Erro na autenticação</h3>
          <p>{{ error }}</p>
          <button (click)="redirectToLogin()" class="retry-btn">
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .callback-content {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    h2 {
      color: #333;
      margin-bottom: 10px;
    }

    p {
      color: #666;
      margin-bottom: 20px;
    }

    .error-message {
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
    }

    .error-message h3 {
      color: #c33;
      margin-bottom: 10px;
    }

    .retry-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }

    .retry-btn:hover {
      background: #5a6fd8;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.handleAuthCallback();
  }

  private async handleAuthCallback() {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      } else {
        this.error = 'Falha na autenticação';
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      this.error = 'Erro ao processar autenticação';
    }
  }



  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}