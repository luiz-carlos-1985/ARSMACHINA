import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../translation.service';
import { AuthService } from '../auth.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentLanguage = 'pt';
  private destroy$ = new Subject<void>();

  passwordRequirements = {
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  };

  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;
  passwordStrengthText = '';
  emailValid = false;
  isEmailChecking = false;
  emailExists = false;

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.initializeLanguageSubscription();
    this.setupFormValidation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  private setupFormValidation() {
    // Email validation with debounce
    this.registerForm.get('email')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(email => {
        if (email && this.registerForm.get('email')?.valid) {
          this.checkEmailAvailability(email);
        }
      });

    // Password validation with real-time feedback
    this.registerForm.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(password => {
        if (password) {
          this.updatePasswordRequirements(password);
          this.calculatePasswordStrength();
        }
      });
  }

  private customEmailValidator(control: AbstractControl) {
    const email = control.value;
    if (!email) return null;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    
    // Additional checks
    const hasConsecutiveDots = /\.{2,}/.test(email);
    const startsOrEndsWithDot = /^\.|\.$/.test(email.split('@')[0]);
    
    if (!isValid || hasConsecutiveDots || startsOrEndsWithDot) {
      return { invalidEmail: true };
    }
    
    return null;
  }

  private passwordValidator(control: AbstractControl) {
    const password = control.value;
    if (!password) return null;

    const errors: any = {};
    
    if (password.length < 8) errors.minLength = true;
    if (!/[A-Z]/.test(password)) errors.uppercase = true;
    if (!/[a-z]/.test(password)) errors.lowercase = true;
    if (!/\d/.test(password)) errors.number = true;
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.specialChar = true;
    
    return Object.keys(errors).length ? errors : null;
  }

  private passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private async checkEmailAvailability(email: string) {
    this.isEmailChecking = true;
    this.emailExists = false;
    
    try {
      // Simulate email check - in real app, call backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check localStorage for existing users (development mode)
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      this.emailExists = existingUsers.some((user: any) => user.email === email);
      
      if (this.emailExists) {
        this.registerForm.get('email')?.setErrors({ emailExists: true });
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
    } finally {
      this.isEmailChecking = false;
    }
  }

  private updatePasswordRequirements(password: string) {
    this.passwordRequirements.minLength = password.length >= 8;
    this.passwordRequirements.uppercase = /[A-Z]/.test(password);
    this.passwordRequirements.lowercase = /[a-z]/.test(password);
    this.passwordRequirements.number = /\d/.test(password);
    this.passwordRequirements.specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }

  private calculatePasswordStrength() {
    let strength = 0;
    const requirements = Object.values(this.passwordRequirements);
    strength = requirements.filter(req => req).length;
    
    this.passwordStrength = (strength / 5) * 100;
    
    if (strength <= 1) {
      this.passwordStrengthText = 'Muito fraca';
    } else if (strength <= 2) {
      this.passwordStrengthText = 'Fraca';
    } else if (strength <= 3) {
      this.passwordStrengthText = 'Média';
    } else if (strength <= 4) {
      this.passwordStrengthText = 'Forte';
    } else {
      this.passwordStrengthText = 'Muito forte';
    }
  }

  isFormValid(): boolean {
    return this.registerForm.valid && !this.emailExists && !this.isEmailChecking;
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    
    if (fieldName === 'email') {
      if (errors['required']) return 'Email é obrigatório';
      if (errors['email'] || errors['invalidEmail']) return 'Email inválido';
      if (errors['emailExists']) return 'Este email já está cadastrado';
    }
    
    if (fieldName === 'password') {
      if (errors['required']) return 'Senha é obrigatória';
      if (errors['minLength']) return 'Senha deve ter no mínimo 8 caracteres';
      return 'Senha não atende aos requisitos';
    }
    
    if (fieldName === 'confirmPassword') {
      if (errors['required']) return 'Confirmação de senha é obrigatória';
      if (this.registerForm.errors?.['passwordMismatch']) return 'Senhas não coincidem';
    }
    
    if (fieldName === 'acceptTerms') {
      if (errors['required']) return 'Você deve aceitar os termos de uso';
    }
    
    return 'Campo inválido';
  }

  private initializeLanguageSubscription() {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  async onSubmit() {
    // Mark all fields as touched to show validation errors
    this.registerForm.markAllAsTouched();
    
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor, corrija os erros no formulário.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formValue = this.registerForm.value;
      
      // Save user to localStorage (development mode)
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const newUser = {
        id: Date.now(),
        email: formValue.email,
        password: formValue.password, // In production, this should be hashed
        registeredAt: new Date().toISOString(),
        isVerified: false
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));
      
      const result = await this.authService.signUp(formValue.email, formValue.password);

      if (result.isSignUpComplete) {
        this.successMessage = 'Conta criada com sucesso! Redirecionando...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.successMessage = 'Conta criada! Verifique seu email para ativar a conta.';
        setTimeout(() => {
          this.router.navigate(['/verify-code'], { queryParams: { email: formValue.email } });
        }, 2000);
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
