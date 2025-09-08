import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';

interface ReportData {
  projects: any[];
  tasks: any[];
  analytics: any;
  activities: any[];
  notifications: any[];
}

@Component({
  selector: 'app-enhanced-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="enhanced-reports-container">
      <div class="reports-header">
        <h2>📊 Sistema Avançado de Relatórios</h2>
        <p>Gere relatórios detalhados com filtros avançados e múltiplos formatos</p>
      </div>

      <!-- Estatísticas em Tempo Real -->
      <div class="live-stats">
        <div class="stat-card">
          <div class="stat-icon">📁</div>
          <div class="stat-value">{{ stats.totalProjects }}</div>
          <div class="stat-label">Projetos</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-value">{{ stats.totalTasks }}</div>
          <div class="stat-label">Tarefas</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-value">{{ stats.productivity }}%</div>
          <div class="stat-label">Produtividade</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">R$ {{ stats.revenue | number:'1.0-0' }}</div>
          <div class="stat-label">Receita</div>
        </div>
      </div>

      <div class="reports-content">
        <!-- Gerador de Relatórios Avançado -->
        <div class="advanced-generator">
          <h3>🚀 Gerador Avançado de Relatórios</h3>
          
          <!-- Seleção de Tipo de Relatório -->
          <div class="report-types-grid">
            <div class="report-type-card" 
                 *ngFor="let type of reportTypes"
                 [class.selected]="selectedReport === type.id"
                 (click)="selectedReport = type.id">
              <div class="type-icon">{{ type.icon }}</div>
              <div class="type-info">
                <div class="type-name">{{ type.name }}</div>
                <div class="type-description">{{ type.description }}</div>
                <div class="type-format">{{ type.format }}</div>
              </div>
            </div>
          </div>

          <!-- Filtros Avançados -->
          <div class="advanced-filters">
            <h4>🔍 Filtros Avançados</h4>
            <div class="filters-grid">
              <div class="filter-group">
                <label>Período</label>
                <div class="date-range">
                  <input type="date" [(ngModel)]="dateFrom" placeholder="De">
                  <span>até</span>
                  <input type="date" [(ngModel)]="dateTo" placeholder="Até">
                </div>
              </div>
              
              <div class="filter-group">
                <label>Formato</label>
                <select [(ngModel)]="selectedFormat">
                  <option value="HTML">HTML (Interativo)</option>
                  <option value="CSV">CSV (Dados)</option>
                  <option value="PDF">PDF (Documento)</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label>Projeto</label>
                <select [(ngModel)]="projectFilter">
                  <option value="all">Todos os Projetos</option>
                  <option *ngFor="let project of reportData.projects" [value]="project.id">
                    {{ project.name }}
                  </option>
                </select>
              </div>
              
              <div class="filter-group">
                <label>Status</label>
                <select [(ngModel)]="statusFilter">
                  <option value="all">Todos os Status</option>
                  <option value="planning">Planejamento</option>
                  <option value="in-progress">Em Andamento</option>
                  <option value="review">Em Revisão</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>
            </div>
            
            <!-- Opções Adicionais -->
            <div class="additional-options">
              <label class="checkbox-option">
                <input type="checkbox" [(ngModel)]="includeCharts">
                <span>📈 Incluir Gráficos e Visualizações</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" [(ngModel)]="includeDetails">
                <span>📋 Incluir Detalhes Completos</span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" [(ngModel)]="includeInsights">
                <span>💡 Incluir Insights e Recomendações</span>
              </label>
            </div>
          </div>

          <!-- Botão de Geração -->
          <div class="generation-section">
            <button class="generate-btn premium" 
                    (click)="generateAdvancedReport()" 
                    [disabled]="isGenerating">
              <span *ngIf="isGenerating" class="spinner"></span>
              <span class="btn-icon">{{ isGenerating ? '⏳' : '🚀' }}</span>
              {{ isGenerating ? 'Processando Relatório...' : 'Gerar Relatório Avançado' }}
            </button>
            
            <div class="generation-info" *ngIf="isGenerating">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="generationProgress"></div>
              </div>
              <p>{{ generationStatus }}</p>
            </div>
          </div>
        </div>

        <!-- Histórico de Relatórios -->
        <div class="reports-history-enhanced">
          <div class="history-header">
            <h3>📚 Histórico de Relatórios</h3>
            <div class="history-actions">
              <button class="action-btn" (click)="exportAllReports()">
                📤 Exportar Todos
              </button>
              <button class="action-btn" (click)="clearHistory()">
                🗑️ Limpar Histórico
              </button>
            </div>
          </div>
          
          <div class="reports-grid" *ngIf="generatedReports.length > 0">
            <div class="report-card" *ngFor="let report of generatedReports">
              <div class="report-header">
                <div class="report-icon">{{ getReportIcon(report.type) }}</div>
                <div class="report-info">
                  <h4>{{ report.name }}</h4>
                  <div class="report-meta">
                    <span class="format-badge" [class]="'format-' + report.format.toLowerCase()">
                      {{ report.format }}
                    </span>
                    <span class="size">{{ report.size }}</span>
                  </div>
                </div>
              </div>
              
              <div class="report-details">
                <div class="detail-item">
                  <span class="label">Gerado:</span>
                  <span class="value">{{ report.generatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div class="detail-item" *ngIf="report.filters">
                  <span class="label">Período:</span>
                  <span class="value">
                    {{ report.filters.dateFrom | date:'dd/MM' }} - {{ report.filters.dateTo | date:'dd/MM' }}
                  </span>
                </div>
                <div class="detail-item" *ngIf="report.filters">
                  <span class="label">Filtros:</span>
                  <span class="value">
                    {{ report.filters.includeCharts ? '📈' : '' }}
                    {{ report.filters.includeDetails ? '📋' : '' }}
                    {{ report.filters.includeInsights ? '💡' : '' }}
                  </span>
                </div>
              </div>
              
              <div class="report-actions">
                <button class="action-btn primary" (click)="downloadReport(report)">
                  📥 Download
                </button>
                <button class="action-btn secondary" (click)="previewReport(report)">
                  👁️ Visualizar
                </button>
                <button class="action-btn danger" (click)="deleteReport(report)">
                  🗑️
                </button>
              </div>
            </div>
          </div>
          
          <div class="empty-state" *ngIf="generatedReports.length === 0">
            <div class="empty-icon">📊</div>
            <h3>Nenhum relatório gerado ainda</h3>
            <p>Use o gerador avançado acima para criar seu primeiro relatório personalizado</p>
          </div>
        </div>

        <!-- Templates de Relatórios -->
        <div class="report-templates">
          <h3>📋 Templates Prontos</h3>
          <div class="templates-grid">
            <div class="template-card" (click)="useTemplate('weekly')">
              <div class="template-icon">📅</div>
              <div class="template-info">
                <h4>Relatório Semanal</h4>
                <p>Resumo semanal de atividades e progresso</p>
              </div>
            </div>
            
            <div class="template-card" (click)="useTemplate('monthly')">
              <div class="template-icon">📊</div>
              <div class="template-info">
                <h4>Relatório Mensal</h4>
                <p>Análise completa mensal com métricas</p>
              </div>
            </div>
            
            <div class="template-card" (click)="useTemplate('executive')">
              <div class="template-icon">👔</div>
              <div class="template-info">
                <h4>Relatório Executivo</h4>
                <p>Dashboard executivo para tomada de decisões</p>
              </div>
            </div>
            
            <div class="template-card" (click)="useTemplate('financial')">
              <div class="template-icon">💰</div>
              <div class="template-info">
                <h4>Relatório Financeiro</h4>
                <p>Análise financeira detalhada por projeto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Preview -->
    <div class="modal-overlay" *ngIf="showPreviewModal" (click)="closePreviewModal()">
      <div class="preview-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>👁️ Preview do Relatório</h3>
          <button class="modal-close" (click)="closePreviewModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="preview-content" [innerHTML]="previewContent"></div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="closePreviewModal()">Fechar</button>
          <button class="btn-primary" (click)="downloadCurrentPreview()">📥 Download</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .enhanced-reports-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .reports-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .reports-header h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .live-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .stat-icon {
      font-size: 2em;
      margin-bottom: 10px;
    }

    .stat-value {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      opacity: 0.9;
      font-size: 0.9em;
    }

    .advanced-generator {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .report-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .report-type-card {
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .report-type-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    }

    .report-type-card.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .type-icon {
      font-size: 2em;
      margin-bottom: 10px;
    }

    .type-name {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .type-description {
      font-size: 0.9em;
      opacity: 0.8;
      margin-bottom: 10px;
    }

    .type-format {
      font-size: 0.8em;
      padding: 4px 8px;
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
      display: inline-block;
    }

    .advanced-filters {
      margin: 30px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .filter-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    .filter-group input,
    .filter-group select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .date-range input {
      flex: 1;
    }

    .additional-options {
      margin-top: 20px;
    }

    .checkbox-option {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      cursor: pointer;
    }

    .checkbox-option input {
      margin-right: 10px;
      width: auto;
    }

    .generation-section {
      text-align: center;
      margin-top: 30px;
    }

    .generate-btn {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .generate-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
    }

    .generate-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .generation-info {
      margin-top: 20px;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #20c997);
      transition: width 0.3s ease;
    }

    .reports-history-enhanced {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .history-actions {
      display: flex;
      gap: 10px;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }

    .report-card {
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .report-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
    }

    .report-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .report-icon {
      font-size: 2em;
      margin-right: 15px;
    }

    .report-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .report-meta {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .format-badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: 600;
    }

    .format-html {
      background: #e3f2fd;
      color: #1976d2;
    }

    .format-csv {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .format-pdf {
      background: #fce4ec;
      color: #c2185b;
    }

    .report-details {
      margin-bottom: 15px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 0.9em;
    }

    .detail-item .label {
      font-weight: 600;
      color: #666;
    }

    .report-actions {
      display: flex;
      gap: 10px;
    }

    .action-btn {
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9em;
      transition: all 0.3s ease;
    }

    .action-btn.primary {
      background: #667eea;
      color: white;
    }

    .action-btn.secondary {
      background: #6c757d;
      color: white;
    }

    .action-btn.danger {
      background: #dc3545;
      color: white;
    }

    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .report-templates {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .template-card {
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .template-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    }

    .template-icon {
      font-size: 3em;
      margin-bottom: 15px;
    }

    .template-info h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .template-info p {
      margin: 0;
      color: #666;
      font-size: 0.9em;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 4em;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      margin-bottom: 10px;
      color: #333;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #ffffff;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .preview-modal {
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }

    .modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .preview-content {
      max-height: 60vh;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
    }

    .modal-footer {
      padding: 20px;
      border-top: 1px solid #e9ecef;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    @media (max-width: 768px) {
      .enhanced-reports-container {
        padding: 10px;
      }
      
      .live-stats {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .report-types-grid {
        grid-template-columns: 1fr;
      }
      
      .filters-grid {
        grid-template-columns: 1fr;
      }
      
      .reports-grid {
        grid-template-columns: 1fr;
      }
      
      .templates-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class EnhancedReportsComponent implements OnInit {
  reportTypes = [
    { 
      id: 'projects', 
      name: 'Relatório de Projetos', 
      icon: '📊', 
      format: 'CSV/HTML/PDF',
      description: 'Lista completa de projetos com status, progresso e prazos detalhados'
    },
    { 
      id: 'tasks', 
      name: 'Relatório de Tarefas', 
      icon: '✅', 
      format: 'CSV/HTML/PDF',
      description: 'Todas as tarefas com prioridades, status e associações a projetos'
    },
    { 
      id: 'analytics', 
      name: 'Relatório de Analytics', 
      icon: '📈', 
      format: 'HTML/PDF',
      description: 'Métricas avançadas de produtividade, performance e satisfação'
    },
    { 
      id: 'complete', 
      name: 'Relatório Executivo', 
      icon: '📋', 
      format: 'HTML/PDF',
      description: 'Dashboard executivo completo com insights estratégicos'
    },
    { 
      id: 'financial', 
      name: 'Relatório Financeiro', 
      icon: '💰', 
      format: 'CSV/HTML/PDF',
      description: 'Análise financeira detalhada com receitas por projeto'
    },
    { 
      id: 'timeline', 
      name: 'Relatório de Timeline', 
      icon: '📅', 
      format: 'HTML/PDF',
      description: 'Cronograma visual de projetos e marcos importantes'
    }
  ];

  selectedReport = 'projects';
  selectedFormat = 'HTML';
  isGenerating = false;
  generationProgress = 0;
  generationStatus = '';
  generatedReports: any[] = [];
  
  // Filtros avançados
  dateFrom = '';
  dateTo = '';
  projectFilter = 'all';
  statusFilter = 'all';
  includeCharts = true;
  includeDetails = true;
  includeInsights = true;
  
  // Modal de preview
  showPreviewModal = false;
  previewContent = '';
  currentPreviewReport: any = null;
  
  // Dados para relatórios
  reportData: ReportData = {
    projects: [],
    tasks: [],
    analytics: {},
    activities: [],
    notifications: []
  };

  // Estatísticas em tempo real
  stats = {
    totalProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    productivity: 0,
    revenue: 0
  };

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.loadGeneratedReports();
    this.loadReportData();
    this.calculateStats();
    this.setDefaultDates();
  }

  private setDefaultDates() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    this.dateTo = today.toISOString().split('T')[0];
    this.dateFrom = lastMonth.toISOString().split('T')[0];
  }

  private loadReportData() {
    // Carregar dados do localStorage
    const dashboardData = localStorage.getItem('dashboardData');
    if (dashboardData) {
      const data = JSON.parse(dashboardData);
      this.reportData = {
        projects: data.activeProjects || [],
        tasks: data.tasks || [],
        analytics: {
          productivity: Math.floor(Math.random() * 20) + 80,
          teamPerformance: Math.floor(Math.random() * 15) + 85,
          clientSatisfaction: Math.floor(Math.random() * 10) + 90,
          revenue: Math.floor(Math.random() * 50000) + 100000
        },
        activities: data.recentActivities || [],
        notifications: data.notifications || []
      };
    }
  }

  private calculateStats() {
    this.stats = {
      totalProjects: this.reportData.projects.length,
      completedProjects: this.reportData.projects.filter(p => p.status === 'completed').length,
      totalTasks: this.reportData.tasks.length,
      completedTasks: this.reportData.tasks.filter(t => t.completed).length,
      productivity: this.reportData.analytics.productivity || 87,
      revenue: this.reportData.analytics.revenue || 125000
    };
  }

  generateAdvancedReport() {
    this.isGenerating = true;
    this.generationProgress = 0;
    
    // Simular progresso de geração
    const progressSteps = [
      { progress: 20, status: 'Coletando dados...' },
      { progress: 40, status: 'Aplicando filtros...' },
      { progress: 60, status: 'Gerando visualizações...' },
      { progress: 80, status: 'Formatando relatório...' },
      { progress: 100, status: 'Finalizando...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        this.generationProgress = progressSteps[currentStep].progress;
        this.generationStatus = progressSteps[currentStep].status;
        currentStep++;
      } else {
        clearInterval(interval);
        this.completeReportGeneration();
      }
    }, 800);
  }

  private completeReportGeneration() {
    const report = {
      id: Date.now(),
      type: this.selectedReport,
      name: this.reportTypes.find(r => r.id === this.selectedReport)?.name,
      format: this.selectedFormat,
      generatedAt: new Date(),
      size: this.calculateReportSize(),
      filters: {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        projectFilter: this.projectFilter,
        statusFilter: this.statusFilter,
        includeCharts: this.includeCharts,
        includeDetails: this.includeDetails,
        includeInsights: this.includeInsights
      }
    };
    
    this.generatedReports.unshift(report);
    this.saveGeneratedReports();
    this.isGenerating = false;
    this.generationProgress = 0;
    this.generationStatus = '';
    
    this.downloadReport(report);
    this.addActivityToDashboard(`Relatório ${report.name} gerado em ${report.format}`);
  }

  private calculateReportSize(): string {
    const baseSize = Math.floor(Math.random() * 500) + 50;
    const multiplier = this.includeCharts ? 1.5 : 1;
    const detailMultiplier = this.includeDetails ? 1.3 : 1;
    const insightMultiplier = this.includeInsights ? 1.2 : 1;
    const finalSize = Math.floor(baseSize * multiplier * detailMultiplier * insightMultiplier);
    
    if (finalSize > 1024) {
      return (finalSize / 1024).toFixed(1) + ' MB';
    }
    return finalSize + ' KB';
  }

  downloadReport(report: any) {
    const content = this.generateReportContent(report);
    const mimeType = this.getMimeType(report.format);
    const extension = report.format.toLowerCase();
    
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.type}-${report.generatedAt.toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'CSV': return 'text/csv';
      case 'PDF': return 'application/pdf';
      case 'HTML': return 'text/html';
      default: return 'text/plain';
    }
  }

  private generateReportContent(report: any): string {
    switch (report.type) {
      case 'projects':
        return this.generateProjectsReport(report);
      case 'tasks':
        return this.generateTasksReport(report);
      case 'analytics':
        return this.generateAnalyticsReport(report);
      case 'complete':
        return this.generateCompleteReport(report);
      case 'financial':
        return this.generateFinancialReport(report);
      case 'timeline':
        return this.generateTimelineReport(report);
      default:
        return this.generateDefaultReport(report);
    }
  }

  private generateProjectsReport(report: any): string {
    if (report.format === 'CSV') {
      const headers = ['Nome,Descrição,Status,Progresso (%),Prazo,Equipe,Criado em'];
      const rows = this.reportData.projects.map(p => 
        `"${p.name}","${p.description || ''}","${p.statusText}",${p.progress},"${p.deadline}",${p.teamSize},"${new Date().toLocaleDateString()}"`
      );
      return [headers, ...rows].join('\n');
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Relatório de Projetos</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background: #f8f9fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; }
        .summary-value { font-size: 2.5em; font-weight: bold; color: #667eea; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; }
        th { background: #667eea; color: white; padding: 15px; text-align: left; }
        td { padding: 15px; border-bottom: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Relatório de Projetos</h1>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    
    <div class="summary">
        <div class="summary-card">
            <div class="summary-value">${this.stats.totalProjects}</div>
            <div class="summary-label">Total de Projetos</div>
        </div>
        <div class="summary-card">
            <div class="summary-value">${this.stats.completedProjects}</div>
            <div class="summary-label">Projetos Concluídos</div>
        </div>
    </div>
    
    <table>
        <thead>
            <tr><th>Projeto</th><th>Status</th><th>Progresso</th><th>Prazo</th><th>Equipe</th></tr>
        </thead>
        <tbody>
            ${this.reportData.projects.map(p => `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.statusText}</td>
                    <td>${p.progress}%</td>
                    <td>${p.deadline}</td>
                    <td>${p.teamSize} membros</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
  }

  private generateTasksReport(report: any): string {
    return `<h1>Relatório de Tarefas</h1><p>Total: ${this.stats.totalTasks} tarefas</p>`;
  }

  private generateAnalyticsReport(report: any): string {
    return `<h1>Relatório de Analytics</h1><p>Produtividade: ${this.stats.productivity}%</p>`;
  }

  private generateCompleteReport(report: any): string {
    return `<h1>Relatório Executivo Completo</h1><p>Dashboard completo gerado em ${new Date().toLocaleDateString()}</p>`;
  }

  private generateFinancialReport(report: any): string {
    return `<h1>Relatório Financeiro</h1><p>Receita: R$ ${this.stats.revenue.toLocaleString()}</p>`;
  }

  private generateTimelineReport(report: any): string {
    return `<h1>Relatório de Timeline</h1><p>Cronograma de projetos</p>`;
  }

  private generateDefaultReport(report: any): string {
    return `<h1>${report.name}</h1><p>Relatório gerado em ${new Date().toLocaleDateString()}</p>`;
  }

  previewReport(report: any) {
    this.currentPreviewReport = report;
    this.previewContent = this.generateReportContent(report);
    this.showPreviewModal = true;
  }

  closePreviewModal() {
    this.showPreviewModal = false;
    this.previewContent = '';
    this.currentPreviewReport = null;
  }

  downloadCurrentPreview() {
    if (this.currentPreviewReport) {
      this.downloadReport(this.currentPreviewReport);
    }
    this.closePreviewModal();
  }

  deleteReport(report: any) {
    if (confirm('Deseja excluir este relatório?')) {
      this.generatedReports = this.generatedReports.filter(r => r.id !== report.id);
      this.saveGeneratedReports();
    }
  }

  exportAllReports() {
    const allReportsData = {
      reports: this.generatedReports,
      exportedAt: new Date().toISOString(),
      totalReports: this.generatedReports.length
    };
    
    const blob = new Blob([JSON.stringify(allReportsData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos-relatorios-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  clearHistory() {
    if (confirm('Deseja limpar todo o histórico de relatórios?')) {
      this.generatedReports = [];
      this.saveGeneratedReports();
    }
  }

  useTemplate(templateType: string) {
    switch (templateType) {
      case 'weekly':
        this.selectedReport = 'complete';
        this.selectedFormat = 'HTML';
        this.includeCharts = true;
        this.includeDetails = false;
        this.includeInsights = true;
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        this.dateFrom = weekAgo.toISOString().split('T')[0];
        break;
      case 'monthly':
        this.selectedReport = 'analytics';
        this.selectedFormat = 'HTML';
        this.includeCharts = true;
        this.includeDetails = true;
        this.includeInsights = true;
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        this.dateFrom = monthAgo.toISOString().split('T')[0];
        break;
      case 'executive':
        this.selectedReport = 'complete';
        this.selectedFormat = 'PDF';
        this.includeCharts = true;
        this.includeDetails = true;
        this.includeInsights = true;
        break;
      case 'financial':
        this.selectedReport = 'financial';
        this.selectedFormat = 'HTML';
        this.includeCharts = true;
        this.includeDetails = true;
        this.includeInsights = true;
        break;
    }
  }

  getReportIcon(type: string): string {
    const reportType = this.reportTypes.find(t => t.id === type);
    return reportType?.icon || '📄';
  }

  private loadGeneratedReports() {
    const saved = localStorage.getItem('enhancedGeneratedReports');
    if (saved) {
      this.generatedReports = JSON.parse(saved).map((r: any) => ({
        ...r,
        generatedAt: new Date(r.generatedAt)
      }));
    }
  }

  private saveGeneratedReports() {
    localStorage.setItem('enhancedGeneratedReports', JSON.stringify(this.generatedReports));
  }

  private addActivityToDashboard(text: string) {
    // Adicionar atividade ao dashboard
    const dashboardData = localStorage.getItem('dashboardData');
    if (dashboardData) {
      const data = JSON.parse(dashboardData);
      const newActivity = {
        type: 'report',
        icon: 'icon-chart',
        text: text,
        time: 'Agora',
        status: 'generated',
        statusText: 'Gerado'
      };
      
      data.recentActivities = data.recentActivities || [];
      data.recentActivities.unshift(newActivity);
      
      // Manter apenas as últimas 10 atividades
      if (data.recentActivities.length > 10) {
        data.recentActivities = data.recentActivities.slice(0, 10);
      }
      
      localStorage.setItem('dashboardData', JSON.stringify(data));
    }
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}
