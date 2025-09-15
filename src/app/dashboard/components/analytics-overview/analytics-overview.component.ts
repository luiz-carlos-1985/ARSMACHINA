import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../translation.service';

@Component({
  selector: 'app-analytics-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-overview">
      <div class="section-header">
        <h2>{{ translationService.translate('dashboard.analytics') }}</h2>
        <div class="section-actions">
          <button class="icon-btn" (click)="onRefresh()" title="Atualizar">🔄</button>
          <button class="icon-btn" (click)="onExport()" title="Exportar">📤</button>
        </div>
      </div>
      <div class="analytics-grid">
        <div class="metric-card productivity">
          <div class="metric-header">
            <div class="metric-icon">⚡</div>
            <div class="metric-info">
              <h3>{{ translationService.translate('dashboard.productivity') }}</h3>
            </div>
          </div>
          <div class="metric-value">{{ analytics.productivityScore }}%</div>
          <div class="metric-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="analytics.productivityScore"></div>
            </div>
          </div>
          <div class="progress-change positive">+12% {{ translationService.translate('dashboard.fromLastMonth') }}</div>
        </div>
        <div class="metric-card performance">
          <div class="metric-header">
            <div class="metric-icon">👥</div>
            <div class="metric-info">
              <h3>{{ translationService.translate('dashboard.teamPerformance') }}</h3>
            </div>
          </div>
          <div class="metric-value">{{ analytics.teamPerformance }}%</div>
          <div class="metric-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="analytics.teamPerformance"></div>
            </div>
          </div>
          <div class="progress-change positive">+8% {{ translationService.translate('dashboard.fromLastMonth') }}</div>
        </div>
        <div class="metric-card satisfaction">
          <div class="metric-header">
            <div class="metric-icon">😊</div>
            <div class="metric-info">
              <h3>{{ translationService.translate('dashboard.clientSatisfaction') }}</h3>
            </div>
          </div>
          <div class="metric-value">{{ analytics.clientSatisfaction }}%</div>
          <div class="metric-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="analytics.clientSatisfaction"></div>
            </div>
          </div>
          <div class="progress-change positive">+15% {{ translationService.translate('dashboard.fromLastMonth') }}</div>
        </div>
        <div class="metric-card revenue">
          <div class="metric-header">
            <div class="metric-icon">💰</div>
            <div class="metric-info">
              <h3>{{ translationService.translate('dashboard.revenue') }}</h3>
            </div>
          </div>
          <div class="metric-value">R$ {{ analytics.revenue | number:'1.0-0' }}</div>
          <div class="revenue-trend">
            <div class="trend-chart">
              <div class="trend-line" [style.height.%]="85"></div>
              <div class="trend-line" [style.height.%]="92"></div>
              <div class="trend-line" [style.height.%]="78"></div>
              <div class="trend-line" [style.height.%]="95"></div>
            </div>
            <div class="trend-change">+22% {{ translationService.translate('dashboard.fromLastMonth') }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './analytics-overview.component.css'
})
export class AnalyticsOverviewComponent {
  @Input() analytics!: {
    productivityScore: number;
    teamPerformance: number;
    clientSatisfaction: number;
    revenue: number;
  };
  @Output() refresh = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  constructor(public translationService: TranslationService) {}

  onRefresh() {
    this.refresh.emit();
  }

  onExport() {
    this.export.emit();
  }
}