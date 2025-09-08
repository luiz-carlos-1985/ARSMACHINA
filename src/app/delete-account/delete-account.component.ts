import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent implements OnInit {
  deleteForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  currentUserEmail = '';
  step = 1; // 1: confirmation, 2: password verification, 3: final confirmation

  constructor(
    private router: Router,
    private authService: AuthService,
    private translationService: TranslationService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadCurrentUser();
  }

  private initializeForm() {
    this.deleteForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmText: ['', [Validators.required, this.confirmTextValidator]],
      reason: ['', [Validators.required]]
    });
  }

  private confirmTextValidator(control: any) {
    const value = control.value;
    return value === 'EXCLUIR CONTA' ? null : { invalidConfirmText: true };
  }

  private async loadCurrentUser() {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        this.currentUserEmail = user.email;
      } else {
        this.router.navigate(['/login']);
      }
    } catch (error) {
      this.router.navigate(['/login']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
      this.errorMessage = '';
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
      this.errorMessage = '';
    }
  }

  async verifyPassword() {
    const password = this.deleteForm.get('password')?.value;
    if (!password) {
      this.errorMessage = 'Senha é obrigatória';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Verify password by attempting to sign in
      await this.authService.signIn(this.currentUserEmail, password);
      this.nextStep();
    } catch (error: any) {
      this.errorMessage = 'Senha incorreta';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteAccount() {
    if (!this.deleteForm.valid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formValue = this.deleteForm.value;
      
      // Delete account
      await this.authService.deleteAccount(this.currentUserEmail, formValue.password, formValue.reason);
      
      this.successMessage = 'Conta excluída com sucesso. Você será redirecionado...';
      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
      
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao excluir conta';
    } finally {
      this.isLoading = false;
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}