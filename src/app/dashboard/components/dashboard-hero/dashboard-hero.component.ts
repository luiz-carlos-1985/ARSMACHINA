import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../translation.service';

@Component({
  selector: 'app-dashboard-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Olá, <span class="user-highlight">{{ userName || 'Usuário' }}</span>!</h1>
          <p class="hero-subtitle">{{ translationService.translate('dashboard.welcome') }}</p>
          <div class="hero-actions">
            <button class="hero-action-btn primary" (click)="onCreateProject()">
              <span class="btn-icon">➕</span>
              {{ translationService.translate('dashboard.newProject') }}
            </button>
            <button class="hero-action-btn secondary" (click)="onGenerateReport()">
              <span class="btn-icon">📊</span>
              {{ translationService.translate('dashboard.generateReport') }}
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-stats">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-number">{{ userStats.projects }}</div>
              <div class="stat-label">{{ translationService.translate('dashboard.projects') }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-number">{{ userStats.tasks }}</div>
              <div class="stat-label">{{ translationService.translate('dashboard.tasks') }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-number">{{ userStats.completed }}</div>
              <div class="stat-label">{{ translationService.translate('dashboard.completed') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard-hero.component.css'
})
export class DashboardHeroComponent {
  @Input() userName!: string;
  @Input() userStats!: any;
  @Output() createProject = new EventEmitter<void>();
  @Output() generateReport = new EventEmitter<void>();

  constructor(public translationService: TranslationService) {}

  onCreateProject() {
    this.createProject.emit();
  }

  onGenerateReport() {
    this.generateReport.emit();
  }
}