import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../translation.service';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quick-actions-bar">
      <div class="actions-container">
        <div class="action-button primary" (click)="onCreateProject()">
          <div class="action-icon">➕</div>
          <div class="action-text">
            <div class="action-title">{{ translationService.translate('dashboard.newProject') }}</div>
            <div class="action-subtitle">Criar um novo projeto</div>
          </div>
        </div>
        <div class="action-button secondary" (click)="onAddTask()">
          <div class="action-icon">📝</div>
          <div class="action-text">
            <div class="action-title">{{ translationService.translate('dashboard.newTask') }}</div>
            <div class="action-subtitle">Adicionar nova tarefa</div>
          </div>
        </div>
        <div class="action-button info" (click)="onScheduleMeeting()">
          <div class="action-icon">📅</div>
          <div class="action-text">
            <div class="action-title">{{ translationService.translate('dashboard.scheduleMeeting') }}</div>
            <div class="action-subtitle">Agendar reunião</div>
          </div>
        </div>
        <div class="action-button success" (click)="onGenerateReport()">
          <div class="action-icon">📊</div>
          <div class="action-text">
            <div class="action-title">{{ translationService.translate('dashboard.generateReport') }}</div>
            <div class="action-subtitle">Gerar relatório</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './quick-actions.component.css'
})
export class QuickActionsComponent {
  @Output() createProject = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<void>();
  @Output() scheduleMeeting = new EventEmitter<void>();
  @Output() generateReport = new EventEmitter<void>();

  constructor(public translationService: TranslationService) {}

  onCreateProject() {
    this.createProject.emit();
  }

  onAddTask() {
    this.addTask.emit();
  }

  onScheduleMeeting() {
    this.scheduleMeeting.emit();
  }

  onGenerateReport() {
    this.generateReport.emit();
  }
}