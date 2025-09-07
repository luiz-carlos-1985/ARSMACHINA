import { Injectable } from '@angular/core';
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, SignUpInput, ConfirmSignUpInput } from 'aws-amplify/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthState();
  }

  async signIn(email: string, password: string) {
    try {
      const result = await signIn({
        username: email,
        password: password,
      });
      this.isAuthenticatedSubject.next(true);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signUp(email: string, password: string) {
    try {
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
      await signOut();
      this.isAuthenticatedSubject.next(false);
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  private async checkAuthState() {
    try {
      await getCurrentUser();
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
    }
  }
}
