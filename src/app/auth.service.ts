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
      // Validate input
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido');
      }

      // Validate password strength
      if (password.length < 8) {
        throw new Error('Senha deve ter no mínimo 8 caracteres');
      }

      if (!/[A-Z]/.test(password)) {
        throw new Error('Senha deve conter pelo menos uma letra maiúscula');
      }

      if (!/[a-z]/.test(password)) {
        throw new Error('Senha deve conter pelo menos uma letra minúscula');
      }

      if (!/\d/.test(password)) {
        throw new Error('Senha deve conter pelo menos um número');
      }

      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        throw new Error('Senha deve conter pelo menos um caractere especial');
      }

      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      if (existingUsers.some((user: any) => user.email === email)) {
        throw new Error('Este email já está cadastrado');
      }

      // Development mode - simulate sign up
      const verificationCode = this.generateVerificationCode();
      
      // Store user data for confirmation
      localStorage.setItem('pending_signup', JSON.stringify({
        email: email,
        password: password,
        verificationCode: verificationCode,
        timestamp: new Date().toISOString(),
        attempts: 0
      }));

      // Try to send verification email, but don't fail if it doesn't work
      try {
        await this.emailService.sendEmailVerification(email, verificationCode);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.warn('Email service not configured, verification code stored locally:', verificationCode);
      }

      return { 
        isSignUpComplete: false,
        nextStep: {
          signUpStep: 'CONFIRM_SIGN_UP'
        }
      };
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  }

  async confirmSignUp(email: string, confirmationCode: string) {
    try {
      if (!email || !confirmationCode) {
        throw new Error('Email e código de verificação são obrigatórios');
      }

      // Development mode - validate confirmation code
      const pendingSignup = localStorage.getItem('pending_signup');
      if (!pendingSignup) {
        throw new Error('Nenhum cadastro pendente encontrado');
      }

      const signupData = JSON.parse(pendingSignup);
      const { email: storedEmail, verificationCode, timestamp, attempts = 0 } = signupData;

      // Check if code has expired (24 hours)
      const codeAge = Date.now() - new Date(timestamp).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (codeAge > maxAge) {
        localStorage.removeItem('pending_signup');
        throw new Error('Código de verificação expirado. Solicite um novo cadastro.');
      }

      // Check attempts limit
      if (attempts >= 5) {
        localStorage.removeItem('pending_signup');
        throw new Error('Muitas tentativas inválidas. Solicite um novo cadastro.');
      }

      if (storedEmail !== email) {
        throw new Error('Email não corresponde ao cadastro pendente');
      }

      if (verificationCode !== confirmationCode) {
        // Increment attempts
        signupData.attempts = attempts + 1;
        localStorage.setItem('pending_signup', JSON.stringify(signupData));
        throw new Error(`Código de verificação inválido. Tentativas restantes: ${5 - signupData.attempts}`);
      }

      // Complete signup in development mode
      localStorage.removeItem('pending_signup');
      
      // Update registered users
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const userIndex = existingUsers.findIndex((user: any) => user.email === email);
      if (userIndex !== -1) {
        existingUsers[userIndex].isVerified = true;
        existingUsers[userIndex].verifiedAt = new Date().toISOString();
        localStorage.setItem('registered_users', JSON.stringify(existingUsers));
      }
      
      // Send welcome email
      try {
        await this.sendWelcomeEmail(email, email.split('@')[0]);
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.warn('Welcome email could not be sent:', emailError);
      }
      
      return { isSignUpComplete: true };
    } catch (error) {
      console.error('ConfirmSignUp error:', error);
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

  /**
   * Delete user account
   */
  async deleteAccount(email: string, password: string, reason: string) {
    try {
      // Validate input
      if (!email || !password || !reason) {
        throw new Error('Todos os campos são obrigatórios');
      }

      // Verify password first
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const user = registeredUsers.find((u: any) => u.email === email);
      
      if (!user || user.password !== password) {
        throw new Error('Senha incorreta');
      }

      // Remove user data
      const updatedUsers = registeredUsers.filter((u: any) => u.email !== email);
      localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

      // Log deletion for audit
      const deletionLog = {
        email: email,
        reason: reason,
        deletedAt: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      const deletionLogs = JSON.parse(localStorage.getItem('deletion_logs') || '[]');
      deletionLogs.push(deletionLog);
      localStorage.setItem('deletion_logs', JSON.stringify(deletionLogs));

      // Send deletion confirmation email
      try {
        await this.emailService.sendAccountDeletionEmail(email, email.split('@')[0]);
      } catch (emailError) {
        console.warn('Deletion confirmation email could not be sent');
      }

      // Clear all user data
      await this.signOut();
      
      console.log('Account deleted successfully:', email);
      return { isAccountDeleted: true };
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
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
