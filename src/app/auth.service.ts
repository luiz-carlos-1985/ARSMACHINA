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

      // Always reload lists to avoid sync conflicts
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const deletionLogs = JSON.parse(localStorage.getItem('deletion_logs') || '[]');
      const isDeleted = deletionLogs.some((log: any) => log.email === email);
      
      // Allow registration if account was deleted, otherwise check for existing active accounts
      const activeUser = existingUsers.find((user: any) => user.email === email && !user.isDeleted);
      if (activeUser && !isDeleted) {
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

      // Send verification email
      try {
        await this.emailService.sendEmailVerification(email, verificationCode);
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue with signup even if email fails
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
      
      // Always reload and update deletion logs if account is being recreated
      const currentDeletionLogs = JSON.parse(localStorage.getItem('deletion_logs') || '[]');
      const updatedLogs = currentDeletionLogs.filter((log: any) => log.email !== email);
      localStorage.setItem('deletion_logs', JSON.stringify(updatedLogs));
      
      // Always reload registered users to avoid sync conflicts
      const currentUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const userIndex = currentUsers.findIndex((user: any) => user.email === email);
      
      if (userIndex !== -1) {
        // Update existing user (could be a previously deleted account)
        currentUsers[userIndex] = {
          ...currentUsers[userIndex],
          isVerified: true,
          verifiedAt: new Date().toISOString(),
          isDeleted: false, // Reactivate if was deleted
          reactivatedAt: new Date().toISOString()
        };
      } else {
        // Create new user
        currentUsers.push({
          email: email,
          isVerified: true,
          verifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem('registered_users', JSON.stringify(currentUsers));
      
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

      // Send verification email
      try {
        await this.emailService.sendEmailVerification(email, verificationCode);
        console.log('Verification email resent successfully');
      } catch (emailError) {
        console.error('Failed to resend verification email:', emailError);
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
   * Delete user account with enhanced logging and validation
   */
  async deleteAccount(email: string, password: string, reason: string) {
    console.log('🗑️ Starting account deletion process for:', email);
    
    try {
      // Step 1: Validate input
      console.log('📋 Step 1: Validating input parameters');
      if (!email || !password || !reason) {
        console.error('❌ Validation failed: Missing required fields');
        throw new Error('Todos os campos são obrigatórios');
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        console.error('❌ Validation failed: Invalid email format');
        throw new Error('Formato de email inválido');
      }



      console.log('✅ Step 1: Input validation completed');

      // Step 2: Verify current user authentication
      console.log('🔐 Step 2: Verifying current user authentication');
      const currentUser = localStorage.getItem('auth_user');
      if (!currentUser) {
        console.error('❌ Authentication failed: No current user session');
        throw new Error('Usuário não está autenticado');
      }

      const authUser = JSON.parse(currentUser);
      if (authUser.email !== email) {
        console.error('❌ Authentication failed: Email mismatch');
        throw new Error('Email não corresponde ao usuário autenticado');
      }

      console.log('✅ Step 2: User authentication verified');

      // Step 3: Verify password (simplified for development)
      console.log('🔑 Step 3: Verifying password');
      
      // In development mode, we'll accept any password for the authenticated user
      // In production, this would verify against the actual stored password
      console.log('✅ Step 3: Password verification skipped in development mode');

      // Step 4: Create deletion audit log
      console.log('📝 Step 4: Creating deletion audit log');
      const deletionLog = {
        id: Date.now().toString(),
        email: email,
        username: authUser.username || email.split('@')[0],
        reason: reason.trim(),
        deletedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: 'localhost', // In development
        sessionData: {
          loginTime: authUser.loginTime,
          lastActivity: new Date().toISOString()
        }
      };
      
      // Always reload deletion_logs to avoid sync conflicts
      const currentDeletionLogs = JSON.parse(localStorage.getItem('deletion_logs') || '[]');
      currentDeletionLogs.push(deletionLog);
      localStorage.setItem('deletion_logs', JSON.stringify(currentDeletionLogs));
      
      console.log('✅ Step 4: Audit log created with ID:', deletionLog.id);

      // Step 5: Send deletion confirmation email
      console.log('📧 Step 5: Sending deletion confirmation email');
      try {
        const emailResult = await this.emailService.sendAccountDeletionEmail(email, authUser.username || email.split('@')[0]);
        console.log('✅ Step 5: Deletion confirmation email sent via', emailResult.method);
      } catch (emailError) {
        console.warn('⚠️ Step 5: All email methods failed, continuing with deletion');
        // Continue with deletion even if email fails
      }

      // Step 6: Implement environment-based deletion strategy
      console.log('🗂️ Step 6: Implementing deletion strategy');
      const isDevelopment = !window.location.hostname.includes('amazonaws.com');
      
      if (isDevelopment) {
        // Development: Real deletion - always reload users list
        console.log('🔧 Development mode: Performing real deletion');
        const currentUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const updatedUsers = currentUsers.filter((u: any) => u.email !== email);
        localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
        console.log('✅ User data permanently deleted in development');
      } else {
        // Production: Soft delete with data protection - always reload users list
        console.log('🛡️ Production mode: Performing soft delete');
        const currentUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const userIndex = currentUsers.findIndex((u: any) => u.email === email);
        if (userIndex !== -1) {
          currentUsers[userIndex] = {
            ...currentUsers[userIndex],
            isDeleted: true,
            deletedAt: new Date().toISOString(),
            deletionReason: reason,
            originalData: { ...currentUsers[userIndex] }
          };
          localStorage.setItem('registered_users', JSON.stringify(currentUsers));
          console.log('✅ User data soft deleted with backup in production');
        }
      }
      
      console.log('✅ Step 6: Deletion strategy completed');

      // Step 7: Clear all user-related data
      console.log('🧹 Step 7: Clearing all user-related data');
      const keysToRemove = [
        'auth_user',
        'pending_signup',
        'password_reset_token',
        'email_verification_code',
        `user_preferences_${email}`,
        `user_todos_${email}`,
        `user_settings_${email}`
      ];

      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🗑️ Removed: ${key}`);
        }
      });

      console.log('✅ Step 7: All user data cleared');

      // Step 8: Update authentication state
      console.log('🔓 Step 8: Updating authentication state');
      this.isAuthenticatedSubject.next(false);
      console.log('✅ Step 8: Authentication state updated');
      
      console.log('🎉 Account deletion completed successfully for:', email);
      
      return { 
        isAccountDeleted: true,
        deletionId: deletionLog.id,
        deletedAt: deletionLog.deletedAt
      };
      
    } catch (error) {
      console.error('💥 Account deletion failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        email: email,
        timestamp: new Date().toISOString()
      });
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
