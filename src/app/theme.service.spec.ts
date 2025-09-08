import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme', () => {
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should toggle theme', () => {
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('dark');
    
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should set specific theme', () => {
    service.setTheme('dark');
    expect(service.getCurrentTheme()).toBe('dark');
  });

  it('should save theme to localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should emit theme changes', () => {
    let currentTheme = '';
    service.currentTheme$.subscribe(theme => currentTheme = theme);
    
    service.setTheme('dark');
    expect(currentTheme).toBe('dark');
  });
});