import { Injectable } from '@angular/core';
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, SignUpInput, ConfirmSignUpInput, resetPassword, confirmResetPassword, resendSignUpCode, ResendSignUpCodeInput } from 'aws-amplify/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmailService } from './email.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private isDevelopmentMode = !window.location.hostname.includes('amazonaws.com');

  constructor(private emailService: EmailService) {
    this.checkAuthState();
  }

  async signIn(email: string, password: string) {
    try {
      // Development mode - allow test credentials
      if (this.isDevelopmentMode && this.isTestCredentials(email, password)) {
        // Simulate successful login for development
        localStorage.setItem('auth_user', JSON.stringify({
          email: email,
          username: email.split('@')[0],
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        }));
        this.isAuthenticatedSubject.next(true);
        return { isSignedIn: true };
      }

      // Production mode - use AWS Amplify
      const result = await signIn({
        username: email,
        password: password,
      });
      
      // Verify the user is actually signed in before updating state
      await getCurrentUser();
      this.isAuthenticatedSubject.next(true);
      
      return result;
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
      throw error;
    }
  }

  private isTestCredentials(email: string, password: string): boolean {
    // Allow common test credentials for development
    const testCredentials = [
      { email: 'test@example.com', password: 'password123' },
      { email: 'admin@test.com', password: 'admin123' },
      { email: 'user@demo.com', password: 'demo123' }
    ];
    
    return testCredentials.some(cred => 
      cred.email === email && cred.password === password
    );
  }

  async signUp(email: string, password: string) {
    try {
      if (this.isDevelopmentMode) {
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
      }

      // Production mode - use AWS Amplify
      const signUpInput: SignUpInput = {
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
          },
        },
      };
      const result = await signUp(signUpInput);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      if (this.isDevelopmentMode) {
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
      }

      // Production mode - use AWS Amplify
      const confirmSignUpInput: ConfirmSignUpInput = {
        username: email,
        confirmationCode: confirmationCode,
      };
      const result = await confirmSignUp(confirmSignUpInput);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    try {
      if (this.isDevelopmentMode) {
        // Development mode - clear local storage
        localStorage.removeItem('auth_user');
        this.isAuthenticatedSubject.next(false);
        return;
      }
      
      // Production mode - use AWS Amplify
      await signOut();
      this.isAuthenticatedSubject.next(false);
    } catch (error) {
      // Even if signOut fails, clear local state
      localStorage.removeItem('auth_user');
      this.isAuthenticatedSubject.next(false);
      throw error;
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
      if (this.isDevelopmentMode) {
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
      }

      // Production mode - use AWS Amplify
      const result = await resetPassword({
        username: email,
      });

      // Send custom email with recovery link
      const resetToken = this.generateResetToken();
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      await this.emailService.sendPasswordRecoveryEmail(email, resetToken, resetLink);

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Confirm password reset with new password
   */
  async confirmPasswordReset(email: string, confirmationCode: string, newPassword: string) {
    try {
      if (this.isDevelopmentMode) {
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
      }

      // Production mode - use AWS Amplify
      const result = await confirmResetPassword({
        username: email,
        confirmationCode: confirmationCode,
        newPassword: newPassword,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resend email verification code
   */
  async resendEmailVerification(email: string) {
    try {
      if (this.isDevelopmentMode) {
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
      }

      // Production mode - use AWS Amplify
      const resendSignUpCodeInput: ResendSignUpCodeInput = {
        username: email,
      };
      const result = await resendSignUpCode(resendSignUpCodeInput);

      // Send custom verification email
      const verificationCode = this.generateVerificationCode();
      await this.emailService.sendEmailVerification(email, verificationCode);

      return result;
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
      if (this.isDevelopmentMode) {
        // Development mode - get from local storage
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          const user = JSON.parse(authUser);
          return user.username || user.email.split('@')[0];
        }
      }
      
      // Production mode - use AWS Amplify
      const user = await getCurrentUser();
      const attributes = user.signInDetails?.loginId || user.username;
      // Try to get name from attributes, fallback to email username
      const name = attributes.split('@')[0]; // Simple fallback
      return name;
    } catch (error) {
      return 'Usuário'; // Fallback
    }
  }

  private async checkAuthState() {
    try {
      if (this.isDevelopmentMode) {
        // Development mode - check local storage
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          const user = JSON.parse(authUser);
          this.isAuthenticatedSubject.next(user.isAuthenticated === true);
          return;
        }
        // If no local auth data, set to false
        this.isAuthenticatedSubject.next(false);
        return;
      }
      
      // Production mode - use AWS Amplify
      await getCurrentUser();
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
    }
  }
}
