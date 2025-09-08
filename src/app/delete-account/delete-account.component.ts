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
  
  isStep3FormValid(): boolean {
    const reason = this.deleteForm.get('reason')?.value;
    const confirmText = this.deleteForm.get('confirmText')?.value;
    const password = this.deleteForm.get('password')?.value;
    
    return !!(reason && confirmText === 'EXCLUIR CONTA' && password);
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
      // For development mode, just validate that password is provided
      // In production, this would verify against actual stored password
      this.nextStep();
    } catch (error: any) {
      this.errorMessage = 'Erro ao verificar senha';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteAccount() {
    console.log('deleteAccount called');
    console.log('Form valid:', this.deleteForm.valid);
    console.log('Form value:', this.deleteForm.value);
    
    // Check individual field validations
    const reason = this.deleteForm.get('reason')?.value;
    const confirmText = this.deleteForm.get('confirmText')?.value;
    const password = this.deleteForm.get('password')?.value;
    
    if (!reason) {
      this.errorMessage = 'Por favor, selecione um motivo para a exclusão';
      return;
    }
    
    if (confirmText !== 'EXCLUIR CONTA') {
      this.errorMessage = 'Digite exatamente "EXCLUIR CONTA" para confirmar';
      return;
    }
    
    if (!password) {
      this.errorMessage = 'Senha é obrigatória';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      console.log('Attempting to delete account for:', this.currentUserEmail);
      
      // Delete account
      const result = await this.authService.deleteAccount(this.currentUserEmail, password, reason);
      
      console.log('Account deletion result:', result);
      
      this.successMessage = 'Conta excluída com sucesso. Redirecionando em 3 segundos...';
      
      // Clear form to prevent resubmission
      this.deleteForm.reset();
      
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 3000);
      
    } catch (error: any) {
      console.error('Delete account error:', error);
      this.errorMessage = error.message || 'Erro ao excluir conta. Tente novamente.';
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