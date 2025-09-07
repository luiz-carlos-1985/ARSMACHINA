import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../translation.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentLanguage = 'pt';

  passwordRequirements = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  };

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeLanguageSubscription();
  }

  onPasswordChange() {
    this.passwordRequirements.minLength = this.password.length >= 8;
    this.passwordRequirements.uppercase = /[A-Z]/.test(this.password);
    this.passwordRequirements.lowercase = /[a-z]/.test(this.password);
    this.passwordRequirements.number = /\d/.test(this.password);
    this.passwordRequirements.specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.password);
  }

  private initializeLanguageSubscription() {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  async onSubmit() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = this.getTranslation('register.fillFields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = this.getTranslation('register.passwordMismatch');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = this.getTranslation('register.passwordTooShort');
      return;
    }

    // Check password requirements
    if (!this.passwordRequirements.minLength ||
        !this.passwordRequirements.uppercase ||
        !this.passwordRequirements.lowercase ||
        !this.passwordRequirements.number ||
        !this.passwordRequirements.specialChar) {
      this.errorMessage = 'A senha deve atender a todos os requisitos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.authService.signUp(this.email, this.password);

      if (result.isSignUpComplete) {
        this.successMessage = this.getTranslation('register.success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.successMessage = this.getTranslation('register.confirmationRequired');
        // In a real app, you might want to navigate to a confirmation page
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
    }
  }

  private getErrorMessage(error: any): string {
    if (error.name === 'UsernameExistsException') {
      return this.getTranslation('register.userExists');
    } else if (error.name === 'InvalidPasswordException') {
      return this.getTranslation('register.invalidPassword');
    } else if (error.name === 'InvalidParameterException') {
      return this.getTranslation('register.invalidParameter');
    } else {
      return error.message || this.getTranslation('register.error');
    }
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}
