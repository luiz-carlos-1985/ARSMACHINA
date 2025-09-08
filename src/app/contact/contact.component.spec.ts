import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { TranslationService } from '../translation.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate', 'getCurrentLanguage'], {
      currentLanguage$: { subscribe: jasmine.createSpy() }
    });

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        { provide: TranslationService, useValue: translationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contact form', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.get('name')).toBeTruthy();
    expect(component.contactForm.get('email')).toBeTruthy();
    expect(component.contactForm.get('message')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.contactForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should handle form submission', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });
});