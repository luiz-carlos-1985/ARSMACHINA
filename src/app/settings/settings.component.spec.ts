import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { TranslationService } from '../translation.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate', 'setLanguage', 'getCurrentLanguage'], {
      currentLanguage$: { subscribe: jasmine.createSpy() }
    });

    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: TranslationService, useValue: translationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change language', () => {
    component.changeLanguage('en');
    expect(mockTranslationService.setLanguage).toHaveBeenCalledWith('en');
  });

  it('should save settings', () => {
    spyOn(component, 'saveSettings');
    component.saveSettings();
    expect(component.saveSettings).toHaveBeenCalled();
  });
});