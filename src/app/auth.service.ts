import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private emailService: EmailService) {
    // Initialize auth state from localStorage only
    this.checkAuthState();
  }

  async signIn(email: string, password: string) {
    try {
      // Always use development mode - no AWS Amplify calls
      console.log('Development mode login for:', email);
      
      // Simulate successful login for any credentials
      localStorage.setItem('auth_user', JSON.stringify({
        email: email,
        username: email.split('@')[0],
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      }));
      
      this.isAuthenticatedSubject.next(true);
      return { isSignedIn: true };
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
      throw error;
    }
  }

  async signUp(email: string, password: string) {
    try {
      // Development mode - simulate sign up
      const verificationCode = this.generateVerificationCode();
      
      // Store user data for confirmation
      localStorage.setItem('pending_signup', JSON.stringify({
        email: email,
        password: password,
        verificationCode: verificationCode,
        timestamp: new Date().toISOString()
      }));

      // Try to send verification email, but don't fail if it doesn't work
      try {
        await this.emailService.sendEmailVerification(email, verificationCode);
      } catch (emailError) {
        console.warn('Email service not configured, verification code stored locally');
      }

      return { 
        isSignUpComplete: false,
        nextStep: {
          signUpStep: 'CONFIRM_SIGN_UP'
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      // Development mode - validate confirmation code
      const pendingSignup = localStorage.getItem('pending_signup');
      if (pendingSignup) {
        const { email: storedEmail, verificationCode } = JSON.parse(pendingSignup);
        if (storedEmail === email && verificationCode === confirmationCode) {
          // Complete signup in development mode
          localStorage.removeItem('pending_signup');
          
          // Send welcome email
          try {
            await this.sendWelcomeEmail(email, email.split('@')[0]);
          } catch (emailError) {
            console.warn('Welcome email could not be sent');
          }
          
          return { isSignUpComplete: true };
        }
      }
      throw new Error('Invalid verification code');
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    try {
      // Always use development mode - clear local storage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('pending_signup');
      localStorage.removeItem('password_reset_token');
      localStorage.removeItem('email_verification_code');
      this.isAuthenticatedSubject.next(false);
      console.log('User signed out successfully');
      return;
    } catch (error) {
      // Even if signOut fails, clear local state
      localStorage.removeItem('auth_user');
      this.isAuthenticatedSubject.next(false);
      console.error('SignOut error:', error);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  /**
   * Initiate password recovery process
   */
  async resetPassword(email: string) {
    try {
      // Development mode - simulate password reset
      const resetToken = this.generateResetToken();
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
      
      // Store reset token for validation
      localStorage.setItem('password_reset_token', JSON.stringify({
        email: email,
        token: resetToken,
        timestamp: new Date().toISOString()
      }));

      // Try to send email, but don't fail if it doesn't work
      try {
        await this.emailService.sendPasswordRecoveryEmail(email, resetToken, resetLink);
      } catch (emailError) {
        console.warn('Email service not configured, password reset token stored locally');
      }

      return { isPasswordReset: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm password reset with new password
   */
  async confirmPasswordReset(email: string, confirmationCode: string, newPassword: string) {
    try {
      // Development mode - validate reset token
      const resetData = localStorage.getItem('password_reset_token');
      if (resetData) {
        const { email: storedEmail, token } = JSON.parse(resetData);
        if (storedEmail === email && token === confirmationCode) {
          // Update password in development mode (just simulate)
          localStorage.removeItem('password_reset_token');
          return { isPasswordReset: true };
        }
      }
      throw new Error('Invalid reset token');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resend email verification code
   */
  async resendEmailVerification(email: string) {
    try {
      // Development mode - simulate email verification
      const verificationCode = this.generateVerificationCode();
      
      // Store verification code for validation
      localStorage.setItem('email_verification_code', JSON.stringify({
        email: email,
        code: verificationCode,
        timestamp: new Date().toISOString()
      }));

      // Try to send email, but don't fail if it doesn't work
      try {
        await this.emailService.sendEmailVerification(email, verificationCode);
      } catch (emailError) {
        console.warn('Email service not configured, verification code stored locally');
      }

      return { isCodeDelivered: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send welcome email after successful registration
   */
  async sendWelcomeEmail(email: string, userName?: string) {
    try {
      await this.emailService.sendWelcomeEmail(email, userName);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email failures
    }
  }

  /**
   * Generate a random reset token
   */
  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate a random verification code
   */
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async getCurrentUserName(): Promise<string> {
    try {
      // Always use development mode - get from local storage
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        return user.username || user.email.split('@')[0];
      }
      return 'Usuário'; // Fallback
    } catch (error) {
      return 'Usuário'; // Fallback
    }
  }

  private checkAuthState() {
    try {
      // Always use development mode - check local storage only
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        this.isAuthenticatedSubject.next(user.isAuthenticated === true);
        console.log('Auth state loaded from localStorage:', user.isAuthenticated);
        return;
      }
      // If no local auth data, set to false
      this.isAuthenticatedSubject.next(false);
      console.log('No auth data found, setting to false');
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
      console.error('Error checking auth state:', error);
    }
  }
}
