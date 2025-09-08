import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailVerificationComponent } from './email-verification.component';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';
import { Router } from '@angular/router';

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['confirmSignUp', 'resendConfirmationCode']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [EmailVerificationComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslationService, useValue: translationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify email with valid code', async () => {
    mockAuthService.confirmSignUp.and.returnValue(Promise.resolve());
    component.email = 'test@example.com';
    component.verificationCode = '123456';

    await component.verifyEmail();

    expect(mockAuthService.confirmSignUp).toHaveBeenCalledWith('test@example.com', '123456');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle verification error', async () => {
    mockAuthService.confirmSignUp.and.returnValue(Promise.reject(new Error('Invalid code')));
    component.email = 'test@example.com';
    component.verificationCode = '123456';

    await component.verifyEmail();

    expect(component.errorMessage).toBeTruthy();
  });

  it('should resend confirmation code', async () => {
    mockAuthService.resendConfirmationCode.and.returnValue(Promise.resolve());
    component.email = 'test@example.com';

    await component.resendCode();

    expect(mockAuthService.resendConfirmationCode).toHaveBeenCalledWith('test@example.com');
  });
});