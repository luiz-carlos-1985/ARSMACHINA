import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';
import { Router } from '@angular/router';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['resetPassword', 'confirmResetPassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslationService, useValue: translationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send reset email', async () => {
    mockAuthService.resetPassword.and.returnValue(Promise.resolve());
    component.email = 'test@example.com';

    await component.sendResetEmail();

    expect(mockAuthService.resetPassword).toHaveBeenCalledWith('test@example.com');
    expect(component.step).toBe(2);
  });

  it('should confirm password reset', async () => {
    mockAuthService.confirmResetPassword.and.returnValue(Promise.resolve());
    component.email = 'test@example.com';
    component.verificationCode = '123456';
    component.newPassword = 'newPassword123';

    await component.confirmReset();

    expect(mockAuthService.confirmResetPassword).toHaveBeenCalledWith('test@example.com', '123456', 'newPassword123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should validate password match', () => {
    component.newPassword = 'password123';
    component.confirmPassword = 'password123';
    expect(component.passwordsMatch()).toBeTruthy();

    component.confirmPassword = 'differentPassword';
    expect(component.passwordsMatch()).toBeFalsy();
  });
});