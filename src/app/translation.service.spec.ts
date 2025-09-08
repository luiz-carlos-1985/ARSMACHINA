import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with Portuguese as default language', () => {
    expect(service.getCurrentLanguage()).toBe('pt');
  });

  it('should change language', () => {
    service.setLanguage('en');
    expect(service.getCurrentLanguage()).toBe('en');
  });

  it('should save language to localStorage', () => {
    service.setLanguage('en');
    expect(localStorage.getItem('language')).toBe('en');
  });

  it('should load language from localStorage', () => {
    localStorage.setItem('language', 'en');
    const newService = new TranslationService();
    expect(newService.getCurrentLanguage()).toBe('en');
  });

  it('should translate keys correctly', () => {
    const translation = service.translate('nav.home');
    expect(translation).toBe('Início');
  });

  it('should return key if translation not found', () => {
    const translation = service.translate('non.existent.key');
    expect(translation).toBe('non.existent.key');
  });

  it('should provide available languages', () => {
    const languages = service.getAvailableLanguages();
    expect(languages).toEqual([
      { code: 'pt', name: 'Português' },
      { code: 'en', name: 'English' }
    ]);
  });

  it('should emit language changes', () => {
    let currentLang = '';
    service.currentLanguage$.subscribe(lang => currentLang = lang);
    
    service.setLanguage('en');
    expect(currentLang).toBe('en');
  });
});