import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent implements OnInit {
  email = '';
  verificationCode = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showCode = false;
  isResending = false;
  canResend = true;
  resendCooldown = 0;
  attemptsRemaining = 5;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });

    if (!this.email) {
      const pendingSignup = localStorage.getItem('pending_signup');
      if (pendingSignup) {
        const data = JSON.parse(pendingSignup);
        this.email = data.email;
        this.attemptsRemaining = 5 - (data.attempts || 0);
        this.showDevelopmentCode();
      } else {
        // No pending signup, redirect to register
        this.router.navigate(['/register']);
        return;
      }
    }

    // Check if user can resend (cooldown)
    this.checkResendCooldown();
  }

  showDevelopmentCode() {
    const pendingSignup = localStorage.getItem('pending_signup');
    if (pendingSignup) {
      const data = JSON.parse(pendingSignup);
      this.successMessage = `Código de verificação: ${data.verificationCode}`;
      this.showCode = true;
    }
  }

  async onSubmit() {
    if (!this.email || !this.verificationCode) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.confirmSignUp(this.email, this.verificationCode);
      
      if (result.isSignUpComplete) {
        this.successMessage = 'Conta criada com sucesso! Redirecionando...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Código de verificação inválido.';
    } finally {
      this.isLoading = false;
    }
  }

  private checkResendCooldown() {
    const lastResend = localStorage.getItem('last_resend_' + this.email);
    if (lastResend) {
      const timeSinceLastResend = Date.now() - parseInt(lastResend);
      const cooldownTime = 60000; // 1 minute
      
      if (timeSinceLastResend < cooldownTime) {
        this.canResend = false;
        this.resendCooldown = Math.ceil((cooldownTime - timeSinceLastResend) / 1000);
        this.startCooldownTimer();
      }
    }
  }

  private startCooldownTimer() {
    const timer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        this.canResend = true;
        clearInterval(timer);
      }
    }, 1000);
  }

  onCodeInput(event: any) {
    // Only allow numbers
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.verificationCode = value;
    event.target.value = value;
    
    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      setTimeout(() => this.onSubmit(), 500);
    }
  }

  async resendCode() {
    if (!this.email || !this.canResend) {
      return;
    }

    this.isResending = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.authService.resendEmailVerification(this.email);
      this.successMessage = 'Novo código enviado!';
      this.showDevelopmentCode();
      
      // Set cooldown
      localStorage.setItem('last_resend_' + this.email, Date.now().toString());
      this.canResend = false;
      this.resendCooldown = 60;
      this.startCooldownTimer();
      
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao reenviar código.';
    } finally {
      this.isResending = false;
    }
  }

  goBackToRegister() {
    localStorage.removeItem('pending_signup');
    this.router.navigate(['/register']);
  }
}