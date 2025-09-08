import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { TranslationService } from '../translation.service';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate', 'getCurrentLanguage'], {
      currentLanguage$: { subscribe: jasmine.createSpy() }
    });

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        { provide: TranslationService, useValue: translationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default language', () => {
    expect(component.currentLanguage).toBe('pt');
  });

  it('should call translation service on getTranslation', () => {
    mockTranslationService.translate.and.returnValue('Test Translation');
    const result = component.getTranslation('test.key');
    expect(mockTranslationService.translate).toHaveBeenCalledWith('test.key');
    expect(result).toBe('Test Translation');
  });
});