import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  confirmationCode = '';
  newPassword = '';
  confirmNewPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  currentLanguage = 'pt';

  constructor(
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.initializeLanguageSubscription();
  }

  private initializeLanguageSubscription() {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  async sendResetEmail() {
    if (!this.email) {
      this.errorMessage = this.getTranslation('resetPassword.enterEmail');
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.resetPassword(this.email);
      this.successMessage = this.getTranslation('resetPassword.emailSent');
    } catch (error: any) {
      this.errorMessage = error.message || this.getTranslation('resetPassword.error');
    } finally {
      this.isLoading = false;
    }
  }

  async confirmReset() {
    if (!this.confirmationCode || !this.newPassword || !this.confirmNewPassword) {
      this.errorMessage = this.getTranslation('resetPassword.fillAllFields');
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = this.getTranslation('resetPassword.passwordMismatch');
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.confirmPasswordReset(this.email, this.confirmationCode, this.newPassword);
      this.successMessage = this.getTranslation('resetPassword.success');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error: any) {
      this.errorMessage = error.message || this.getTranslation('resetPassword.error');
    } finally {
      this.isLoading = false;
    }
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}
