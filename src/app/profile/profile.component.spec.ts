import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'updateUserProfile']);
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate'], {
      currentLanguage$: { subscribe: jasmine.createSpy() }
    });

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: TranslationService, useValue: translationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    const mockUser = { email: 'test@example.com', name: 'Test User' };
    mockAuthService.getCurrentUser.and.returnValue(Promise.resolve(mockUser));
    
    component.ngOnInit();
    
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
  });

  it('should handle profile update', () => {
    mockAuthService.updateUserProfile.and.returnValue(Promise.resolve());
    
    component.updateProfile();
    
    expect(mockAuthService.updateUserProfile).toHaveBeenCalled();
  });
});