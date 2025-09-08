import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<string>('light');
  public theme$ = this.currentTheme.asObservable();

  constructor() {
    this.loadTheme();
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  setTheme(theme: string) {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
  }

  getCurrentTheme(): string {
    return this.currentTheme.value;
  }

  toggleTheme() {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}