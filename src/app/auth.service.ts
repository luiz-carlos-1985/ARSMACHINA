import { Injectable } from '@angular/core';
import { signIn, signOut, getCurrentUser, SignInInput } from 'aws-amplify/auth';
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
      const signInInput: SignInInput = {
        username: email,
        password: password,
      };
      const result = await signIn(signInInput);
      this.isAuthenticatedSubject.next(true);
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
