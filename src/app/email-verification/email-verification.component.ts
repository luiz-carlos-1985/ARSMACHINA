import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  email = '';
  confirmationCode = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  currentLanguage = 'pt';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translationService: TranslationService
  ) {
    this.initializeLanguageSubscription();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
    this.initializeLanguageSubscription();
  }

  private initializeLanguageSubscription() {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  async verifyEmail() {
    if (!this.email || !this.confirmationCode) {
      this.errorMessage = this.getTranslation('emailVerification.fillFields');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.authService.confirmSignUp(this.email, this.confirmationCode);
      this.successMessage = this.getTranslation('emailVerification.success');

      // Send welcome email
      await this.authService.sendWelcomeEmail(this.email);

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } catch (error: any) {
      console.error('Email verification error:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  async resendCode() {
    if (!this.email) {
      this.errorMessage = this.getTranslation('emailVerification.enterEmail');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.resendEmailVerification(this.email);
      this.successMessage = this.getTranslation('emailVerification.codeSent');
    } catch (error: any) {
      this.errorMessage = error.message || this.getTranslation('emailVerification.error');
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(error: any): string {
    if (error.name === 'CodeMismatchException') {
      return this.getTranslation('emailVerification.invalidCode');
    } else if (error.name === 'ExpiredCodeException') {
      return this.getTranslation('emailVerification.expiredCode');
    } else if (error.name === 'NotAuthorizedException') {
      return this.getTranslation('emailVerification.notAuthorized');
    } else {
      return error.message || this.getTranslation('emailVerification.error');
    }
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}
