import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService } from '../translation.service';
import { AuthService } from '../auth.service';
import { EmailService } from '../email.service';
import { ProfileComponent } from '../profile/profile.component';
import { SettingsComponent } from '../settings/settings.component';
import { ReportsComponent } from '../reports/reports.component';
import { EnhancedReportsComponent } from '../reports/enhanced-reports.component';
import { HelpComponent } from '../help/help.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileComponent, SettingsComponent, ReportsComponent, EnhancedReportsComponent, HelpComponent, ChatbotComponent],
  providers: [AuthService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(ChatbotComponent) chatbot!: ChatbotComponent;
  currentLanguage = 'pt';

  // User data
  userName: string = 'Usuário';
  
  userProfile = {
    name: '',
    email: '',
    phone: '',
    company: 'Ars Machina Consultancy',
    position: '',
    bio: '',
    avatar: '',
    notifications: {
      email: true,
      projects: true
    }
  };
  
  originalProfile: any = {};

  userStats = {
    projects: 12,
    tasks: 45,
    completed: 38
  };

  // Analytics data
  productivityScore = 87;
  teamPerformance = 92;
  clientSatisfaction = 94;
  revenue = 125000;

  // Financial data
  monthlyRevenue = 185000;
  monthlyExpenses = 65000;
  netProfit = 120000;
  pendingReceivables = 45000;
  pendingInvoices = 8;

  // Client data
  activeClients = [
    {
      id: 1,
      name: 'Ars Machina IT Consultancy',
      email: 'contato@arsmachinaconsultancy.com',
      phone: '+55 98 99964-9215',
      company: 'Ars Machina IT Solutions',
      status: 'active',
      statusText: 'Ativo',
      contractValue: 5000000,
      contractStart: '2024-01-01',
      contractEnd: '2024-12-31',
      notes: ''
    },
    {
      id: 2,
      name: 'InnovateHub',
      email: 'admin@innovatehub.com',
      phone: '+55 21 8888-7777',
      company: 'InnovateHub',
      status: 'active',
      statusText: 'Ativo',
      contractValue: 120000,
      contractStart: '2024-07-01',
      contractEnd: '2025-06-30',
      notes: ''
    },
    {
      id: 3,
      name: 'DataFlow Systems',
      email: 'info@dataflow.com',
      phone: '+55 11 7777-6666',
      company: 'DataFlow Systems',
      status: 'pending',
      statusText: 'Pendente',
      contractValue: 95000,
      contractStart: '2024-05-15',
      contractEnd: '2024-11-15',
      notes: ''
    }
  ];

  // Team data
  teamMembers = [
    {
      id: 1,
      name: 'Ana Silva',
      role: 'Desenvolvedora Senior',
      activeProjects: 3,
      efficiency: 94,
      status: 'available',
      statusText: 'Disponível'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      role: 'Arquiteto de Software',
      activeProjects: 2,
      efficiency: 89,
      status: 'busy',
      statusText: 'Ocupado'
    },
    {
      id: 3,
      name: 'Maria Costa',
      role: 'DevOps Engineer',
      activeProjects: 4,
      efficiency: 96,
      status: 'available',
      statusText: 'Disponível'
    },
    {
      id: 4,
      name: 'João Oliveira',
      role: 'UX/UI Designer',
      activeProjects: 2,
      efficiency: 91,
      status: 'vacation',
      statusText: 'Férias'
    }
  ];

  // Modal states
  showProjectModal = false;
  showTaskModal = false;
  isEditingProject = false;
  isEditingTask = false;
  showMeetingModal = false;
  showReportModal = false;
  showTeamModal = false;
  showProfileModal = false;
  showSettingsModal = false;
  showHelpModal = false;
  isEditingProfile = false;
  profileSaving = false;
  
  // Component states
  showProfileComponent = false;
  showSettingsComponent = false;
  showReportsComponent = false;
  showHelpComponent = false;
  
  // Filter and search states
  projectFilter = 'all';
  taskFilter = 'all';
  searchTerm = '';
  
  // Tab management
  activeTab = 'overview';
  
  // Meeting data
  currentMeeting: any = {
    id: null,
    title: '',
    date: '',
    time: '',
    participants: '',
    description: ''
  };
  
  meetings: any[] = [];

  // Current project/task being edited
  currentProject: any = {
    id: null,
    name: '',
    description: '',
    status: 'planning',
    deadline: '',
    teamSize: 1
  };

  currentTask: any = {
    id: null,
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    dueDate: '',
    completed: false
  };

  // Tasks list
  tasks: any[] = [];

  // Recent activities
  recentActivities = [
    {
      type: 'project',
      icon: 'icon-plus',
      text: 'Novo projeto "Sistema ERP" foi criado',
      time: '2 horas atrás',
      status: 'success',
      statusText: 'Criado'
    },
    {
      type: 'task',
      icon: 'icon-check',
      text: 'Tarefa "Revisão de código" foi concluída',
      time: '4 horas atrás',
      status: 'completed',
      statusText: 'Concluída'
    },
    {
      type: 'meeting',
      icon: 'icon-calendar',
      text: 'Reunião com cliente agendada para amanhã',
      time: '6 horas atrás',
      status: 'scheduled',
      statusText: 'Agendada'
    },
    {
      type: 'report',
      icon: 'icon-chart',
      text: 'Relatório mensal gerado com sucesso',
      time: '1 dia atrás',
      status: 'generated',
      statusText: 'Gerado'
    }
  ];

  // Active projects
  activeProjects = [
    {
      id: 1,
      name: 'Sistema de Gestão Empresarial',
      description: 'Sistema completo de gestão empresarial com módulos financeiro, RH e vendas',
      status: 'in-progress',
      statusText: 'Em Andamento',
      progress: 75,
      deadline: '2024-12-15',
      teamSize: 8
    },
    {
      id: 2,
      name: 'Aplicativo Mobile E-commerce',
      description: 'Aplicativo mobile para vendas online com integração de pagamentos',
      status: 'review',
      statusText: 'Em Revisão',
      progress: 90,
      deadline: '2024-12-20',
      teamSize: 5
    },
    {
      id: 3,
      name: 'Plataforma de Análise de Dados',
      description: 'Dashboard analítico com visualizações interativas e relatórios',
      status: 'planning',
      statusText: 'Planejamento',
      progress: 25,
      deadline: '2025-01-10',
      teamSize: 6
    }
  ];

  // Notifications
  notifications = [
    {
      type: 'warning',
      icon: 'icon-alert',
      text: 'Prazo do projeto "Sistema ERP" se aproxima',
      time: '1 hora atrás',
      read: false
    },
    {
      type: 'info',
      icon: 'icon-info',
      text: 'Nova versão do sistema disponível',
      time: '3 horas atrás',
      read: false
    },
    {
      type: 'success',
      icon: 'icon-check',
      text: 'Backup automático concluído com sucesso',
      time: '6 horas atrás',
      read: true
    }
  ];

  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  constructor(
    private translationService: TranslationService,
    private authService: AuthService,
    private router: Router,
    private emailService: EmailService
  ) {}

  ngAfterViewInit() {
    // ViewChild is now available
  }

  async ngOnInit() {
    this.initializeLanguageSubscription();
    this.userName = await this.authService.getCurrentUserName();
    await this.loadUserProfile();
    this.loadFromLocalStorage();
    this.updateTaskStats();
    this.applyUserSettings();
    this.setupAutoRefresh();
    
    // Ensure translation service is initialized
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    // Listen for navigation events from navbar
    window.addEventListener('navigate-to-section', (event: any) => {
      const section = event.detail.section;
      this.navigateTo(section);
    });
  }
  
  private addMobileEventListeners() {
    // Get all action buttons
    const buttons = document.querySelectorAll('.hero-action-btn, .action-button');
    
    buttons.forEach((button, index) => {
      // Remove existing listeners
      button.removeEventListener('touchstart', this.handleTouch);
      button.removeEventListener('click', this.handleClick);
      
      // Add new listeners
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.handleButtonClick(index);
      }, { passive: false });
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleButtonClick(index);
      });
    });
  }
  
  private handleButtonClick(index: number) {
    console.log('Button clicked:', index);
    
    switch(index) {
      case 0: // First hero button or first action button
        this.createNewProject();
        break;
      case 1: // Second hero button or second action button
        if (document.querySelector('.hero-action-btn.secondary')) {
          this.generateReport();
        } else {
          this.addNewTask();
        }
        break;
      case 2: // Third action button
        this.scheduleMeeting();
        break;
      case 3: // Fourth action button
        this.generateReport();
        break;
    }
  }
  
  private handleTouch = (e: Event) => {
    e.preventDefault();
  }
  
  private handleClick = (e: Event) => {
    e.preventDefault();
  }

  private initializeLanguageSubscription() {
    // Get current language immediately
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    // Subscribe to language changes
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
      console.log('Language changed to:', lang);
    });
  }

  getTranslation(key: string): string {
    const translation = this.translationService.translate(key);
    // Debug: log if translation is missing
    if (translation === key) {
      console.warn(`Translation missing for key: ${key}`);
    }
    return translation;
  }

  // Icon helper methods
  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'project': '📁',
      'task': '✅',
      'meeting': '📅',
      'report': '📊',
      'analytics': '📈',
      'support': '🎧'
    };
    return icons[type] || '📋';
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'warning': '⚠️',
      'info': 'ℹ️',
      'success': '✅',
      'error': '❌'
    };
    return icons[type] || 'ℹ️';
  }

  // Quick Actions
  createNewProject() {
    console.log('createNewProject called');
    this.currentProject = {
      id: null,
      name: '',
      description: '',
      status: 'planning',
      deadline: '',
      teamSize: 1
    };
    this.isEditingProject = false;
    this.showProjectModal = true;
  }

  addNewTask() {
    console.log('addNewTask called');
    this.currentTask = {
      id: null,
      title: '',
      description: '',
      projectId: '',
      priority: 'medium',
      dueDate: '',
      completed: false
    };
    this.isEditingTask = false;
    this.showTaskModal = true;
  }

  scheduleMeeting() {
    console.log('scheduleMeeting called');
    this.openMeetingModal();
  }

  generateReport() {
    console.log('generateReport called');
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
  }

  generateSelectedReport(type: string) {
    const date = new Date().toISOString().split('T')[0];
    
    switch (type) {
      case 'projects':
        this.generateProjectsCSV(date);
        break;
      case 'tasks':
        this.generateTasksCSV(date);
        break;
      case 'analytics':
        this.generateAnalyticsHTML(date);
        break;
      case 'complete':
        this.generateCompleteHTML(date);
        break;
    }
    
    this.closeReportModal();
  }
  
  private generateProjectsCSV(date: string) {
    const headers = ['Nome,Descrição,Status,Progresso (%),Prazo,Equipe,Criado em'];
    const rows = this.activeProjects.map(p => 
      `"${p.name}","${p.description || ''}","${p.statusText}",${p.progress},"${p.deadline}",${p.teamSize},"${date}"`
    );
    
    const csvContent = [headers, ...rows].join('\n');
    this.downloadFile(csvContent, `relatorio-projetos-${date}.csv`, 'text/csv');
    
    this.addActivity('Relatório de Projetos (CSV) gerado', 'report', 'icon-chart', 'generated', 'Gerado');
    alert('Relatório de Projetos gerado em CSV!');
  }
  
  private generateTasksCSV(date: string) {
    const headers = ['Título,Descrição,Projeto,Prioridade,Status,Data Vencimento,Criado em'];
    const rows = this.tasks.map(t => {
      const project = this.activeProjects.find(p => p.id === t.projectId);
      return `"${t.title}","${t.description || ''}","${project?.name || 'N/A'}","${t.priority}","${t.completed ? 'Concluída' : 'Pendente'}","${t.dueDate || ''}","${date}"`;
    });
    
    const csvContent = [headers, ...rows].join('\n');
    this.downloadFile(csvContent, `relatorio-tarefas-${date}.csv`, 'text/csv');
    
    this.addActivity('Relatório de Tarefas (CSV) gerado', 'report', 'icon-chart', 'generated', 'Gerado');
    alert('Relatório de Tarefas gerado em CSV!');
  }
  
  private generateAnalyticsHTML(date: string) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Relatório de Analytics - ${date}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .metric { background: #f5f5f5; padding: 20px; margin: 10px 0; border-radius: 8px; }
        .metric h3 { margin: 0 0 10px 0; color: #333; }
        .value { font-size: 2em; font-weight: bold; color: #667eea; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Relatório de Analytics</h1>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    
    <div class="metric">
        <h3>⚡ Produtividade</h3>
        <div class="value">${this.productivityScore}%</div>
    </div>
    
    <div class="metric">
        <h3>👥 Performance da Equipe</h3>
        <div class="value">${this.teamPerformance}%</div>
    </div>
    
    <div class="metric">
        <h3>😊 Satisfação do Cliente</h3>
        <div class="value">${this.clientSatisfaction}%</div>
    </div>
    
    <div class="metric">
        <h3>💰 Receita</h3>
        <div class="value">R$ ${this.revenue.toLocaleString('pt-BR')}</div>
    </div>
</body>
</html>`;
    
    this.downloadFile(html, `relatorio-analytics-${date}.html`, 'text/html');
    
    this.addActivity('Relatório de Analytics (HTML) gerado', 'report', 'icon-chart', 'generated', 'Gerado');
    alert('Relatório de Analytics gerado em HTML!');
  }
  
  private generateCompleteHTML(date: string) {
    const completedTasks = this.tasks.filter(t => t.completed).length;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Relatório Completo - ${date}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; }
        .summary-value { font-size: 2em; font-weight: bold; color: #667eea; }
        .section { margin: 30px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #667eea; color: white; }
        .status-planning { background: #fff3cd; }
        .status-in-progress { background: #d1ecf1; }
        .status-review { background: #f8d7da; }
        .status-completed { background: #d4edda; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Relatório Completo do Dashboard</h1>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    
    <div class="summary">
        <div class="summary-card">
            <div class="summary-value">${this.activeProjects.length}</div>
            <div>Projetos Ativos</div>
        </div>
        <div class="summary-card">
            <div class="summary-value">${this.tasks.length}</div>
            <div>Total de Tarefas</div>
        </div>
        <div class="summary-card">
            <div class="summary-value">${completedTasks}</div>
            <div>Tarefas Concluídas</div>
        </div>
        <div class="summary-card">
            <div class="summary-value">${this.productivityScore}%</div>
            <div>Produtividade</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Projetos</h2>
        <table>
            <tr><th>Nome</th><th>Status</th><th>Progresso</th><th>Prazo</th><th>Equipe</th></tr>
            ${this.activeProjects.map(p => `
                <tr class="status-${p.status}">
                    <td>${p.name}</td>
                    <td>${p.statusText}</td>
                    <td>${p.progress}%</td>
                    <td>${p.deadline}</td>
                    <td>${p.teamSize} membros</td>
                </tr>
            `).join('')}
        </table>
    </div>
    
    <div class="section">
        <h2>Atividades Recentes</h2>
        <ul>
            ${this.recentActivities.slice(0, 10).map(a => `<li>${a.text} - ${a.time}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;
    
    this.downloadFile(html, `relatorio-completo-${date}.html`, 'text/html');
    
    this.addActivity('Relatório Completo (HTML) gerado', 'report', 'icon-chart', 'generated', 'Gerado');
    alert('Relatório Completo gerado em HTML!');
  }
  
  private downloadFile(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Project Management
  saveProject() {
    if (!this.currentProject.name.trim()) {
      alert('Nome do projeto é obrigatório!');
      return;
    }
    if (!this.currentProject.deadline) {
      alert('Data de entrega é obrigatória!');
      return;
    }
    if (this.currentProject.teamSize < 1) {
      alert('Tamanho da equipe deve ser pelo menos 1!');
      return;
    }

    if (this.isEditingProject) {
      // Update existing project
      const index = this.activeProjects.findIndex(p => p.id === this.currentProject.id);
      if (index !== -1) {
        this.activeProjects[index] = { 
          ...this.currentProject,
          statusText: this.getStatusText(this.currentProject.status)
        };
        this.addActivity(`Projeto "${this.currentProject.name}" foi atualizado`, 'project', 'icon-edit', 'updated', 'Atualizado');
      }
    } else {
      // Create new project
      const newProject = {
        ...this.currentProject,
        id: Date.now(), // Simple ID generation
        progress: 0,
        statusText: this.getStatusText(this.currentProject.status)
      };
      this.activeProjects.push(newProject);
      this.userStats.projects = this.activeProjects.length;
      this.addActivity(`Novo projeto "${newProject.name}" foi criado`, 'project', 'icon-plus', 'created', 'Criado');
    }
    
    this.closeProjectModal();
    this.saveToLocalStorage();
  }

  editProject(project: any) {
    this.currentProject = { ...project };
    this.isEditingProject = true;
    this.showProjectModal = true;
  }

  closeProjectModal() {
    this.showProjectModal = false;
    this.isEditingProject = false;
  }

  // Task Management
  saveTask() {
    if (!this.currentTask.title.trim()) {
      alert('Título da tarefa é obrigatório!');
      return;
    }
    if (!this.currentTask.dueDate) {
      alert('Data de vencimento é obrigatória!');
      return;
    }

    if (this.isEditingTask) {
      // Update existing task
      const index = this.tasks.findIndex(t => t.id === this.currentTask.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.currentTask };
        this.addActivity(`Tarefa "${this.currentTask.title}" foi atualizada`, 'task', 'icon-edit', 'updated', 'Atualizada');
      }
    } else {
      // Create new task
      const newTask = {
        ...this.currentTask,
        id: Date.now(), // Simple ID generation
        createdAt: new Date().toISOString()
      };
      this.tasks.push(newTask);
      this.userStats.tasks = this.tasks.length;
      this.addActivity(`Nova tarefa "${newTask.title}" foi criada`, 'task', 'icon-plus', 'created', 'Criada');
    }
    
    this.closeTaskModal();
    this.updateTaskStats();
    this.saveToLocalStorage();
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.isEditingTask = false;
  }

  updateTaskStats() {
    const completedTasks = this.tasks.filter(t => t.completed).length;
    this.userStats.completed = completedTasks;
    this.userStats.tasks = this.tasks.length;
  }

  // Activities
  viewAllActivities() {
    this.router.navigate(['/activities']);
  }

  // Notifications
  markAsRead(notification: any) {
    notification.read = true;
    this.saveToLocalStorage();
  }

  dismissNotification(notification: any) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  viewAllNotifications() {
    this.router.navigate(['/notifications']);
  }

  // Projects
  manageProjects() {
    // Navigate to the dedicated projects page
    this.router.navigate(['/projects']);
  }

  openProjectMenu(project: any) {
    // Show context menu options
    const options = [
      'Visualizar Detalhes',
      'Editar Projeto',
      'Adicionar Tarefa',
      'Ver Progresso',
      'Arquivar Projeto'
    ];
    
    const choice = prompt(`Projeto: ${project.name}\n\nEscolha uma opção:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`);
    
    if (choice) {
      const optionIndex = parseInt(choice) - 1;
      switch (optionIndex) {
        case 0:
          this.viewProjectDetails(project);
          break;
        case 1:
          this.editProject(project);
          break;
        case 2:
          this.addTaskToProject(project);
          break;
        case 3:
          this.viewProjectProgress(project);
          break;
        case 4:
          this.archiveProject(project);
          break;
        default:
          break;
      }
    }
  }

  addTaskToProject(project: any) {
    this.currentTask = {
      id: null,
      title: '',
      description: '',
      projectId: project.id,
      priority: 'medium',
      dueDate: '',
      completed: false
    };
    this.isEditingTask = false;
    this.showTaskModal = true;
  }

  viewProjectDetails(project: any) {
    const projectTasks = this.tasks.filter(t => t.projectId === project.id);
    const completedTasks = projectTasks.filter(t => t.completed).length;
    const totalTasks = projectTasks.length;
    
    alert(`Detalhes do Projeto: ${project.name}\n\nDescrição: ${project.description}\nStatus: ${project.statusText}\nProgresso: ${project.progress}%\nPrazo: ${project.deadline}\nEquipe: ${project.teamSize} membros\nTarefas: ${completedTasks}/${totalTasks} concluídas`);
  }

  viewProjectProgress(project: any) {
    const projectTasks = this.tasks.filter(t => t.projectId === project.id);
    const completedTasks = projectTasks.filter(t => t.completed).length;
    const totalTasks = projectTasks.length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    alert(`Progresso do Projeto: ${project.name}\n\nTarefas: ${completedTasks}/${totalTasks} concluídas\nProgresso: ${progressPercentage}%\nPrazo: ${project.deadline}\nEquipe: ${project.teamSize} membros`);
  }

  archiveProject(project: any) {
    if (confirm(`Tem certeza que deseja arquivar o projeto "${project.name}"?`)) {
      const index = this.activeProjects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        this.activeProjects.splice(index, 1);
        this.userStats.projects = this.activeProjects.length;
        this.addActivity(`Projeto "${project.name}" foi arquivado`, 'project', 'icon-archive', 'archived', 'Arquivado');
        this.saveToLocalStorage();
      }
    }
  }

  // Client Management
  showClientModal = false;
  showClientForm = false;
  isEditingClient = false;
  clientSearchTerm = '';
  clientStatusFilter = 'all';
  activeClientMenu: number | null = null;
  currentClient: any = {
    id: null,
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active',
    contractValue: 0,
    contractStart: '',
    contractEnd: '',
    notes: ''
  };

  manageClients() {
    this.showClientModal = true;
  }

  closeClientModal() {
    this.showClientModal = false;
    this.isEditingClient = false;
  }

  createNewClient() {
    this.currentClient = {
      id: null,
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'active',
      contractValue: 0,
      contractStart: '',
      contractEnd: '',
      notes: ''
    };
    this.isEditingClient = false;
    this.showClientForm = true;
  }

  closeClientForm() {
    this.showClientForm = false;
    this.isEditingClient = false;
    this.activeClientMenu = null;
  }

  resetForm() {
    this.currentClient = {
      id: null,
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'active',
      contractValue: 0,
      contractStart: '',
      contractEnd: '',
      notes: ''
    };
    this.isEditingClient = false;
  }

  // Método para resetar filtros
  resetClientFilters() {
    this.clientSearchTerm = '';
    this.clientStatusFilter = 'all';
  }

  toggleClientMenu(clientId: number) {
    this.activeClientMenu = this.activeClientMenu === clientId ? null : clientId;
  }

  closeClientMenu() {
    this.activeClientMenu = null;
  }

  getFilteredClients() {
    let filtered = this.activeClients;
    
    // Filtro por status
    if (this.clientStatusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === this.clientStatusFilter);
    }
    
    // Busca por termo
    if (this.clientSearchTerm && this.clientSearchTerm.trim()) {
      const term = this.clientSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.replace(/\D/g, '').includes(term.replace(/\D/g, '')) ||
        (c.company && c.company.toLowerCase().includes(term)) ||
        c.contractValue.toString().includes(term) ||
        (c.notes && c.notes.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  }

  // Método para limpar busca
  clearClientSearch() {
    this.clientSearchTerm = '';
  }

  trackByClientId(index: number, client: any): number {
    return client.id;
  }

  // Método para busca rápida por status
  filterByStatus(status: string) {
    this.clientStatusFilter = status;
    this.clientSearchTerm = '';
  }

  getActiveClientsCount(): number {
    return this.activeClients.filter(c => c.status === 'active').length;
  }

  getAverageContractValue(): number {
    if (this.activeClients.length === 0) return 0;
    return this.getTotalContractValue() / this.activeClients.length;
  }

  getClientAvatarColor(name: string): string {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  isContractExpired(client: any): boolean {
    if (!client.contractEnd) return false;
    return new Date(client.contractEnd) < new Date();
  }

  getDaysUntilExpiry(client: any): number {
    if (!client.contractEnd) return 0;
    const today = new Date();
    const endDate = new Date(client.contractEnd);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  viewClientDetails(client: any) {
    const details = `
      Cliente: ${client.name}
      ${client.company ? `Empresa: ${client.company}` : ''}
      Email: ${client.email}
      Telefone: ${client.phone}
      Status: ${client.statusText}
      Valor do Contrato: R$ ${client.contractValue.toLocaleString('pt-BR')}
      ${client.contractStart ? `Início: ${new Date(client.contractStart).toLocaleDateString('pt-BR')}` : ''}
      ${client.contractEnd ? `Fim: ${new Date(client.contractEnd).toLocaleDateString('pt-BR')}` : ''}
      ${client.notes ? `Observações: ${client.notes}` : ''}
    `;
    alert(details);
  }

  duplicateClient(client: any) {
    this.currentClient = {
      ...client,
      id: null,
      name: `${client.name} (Cópia)`,
      email: '',
      contractStart: '',
      contractEnd: ''
    };
    this.isEditingClient = false;
    this.showClientForm = true;
  }

  editClient(client: any) {
    this.currentClient = { ...client };
    this.isEditingClient = true;
    this.showClientForm = true;
  }

  saveClient() {
    if (!this.currentClient.name.trim()) {
      alert('Nome do cliente é obrigatório!');
      return;
    }
    if (!this.currentClient.email.trim()) {
      alert('Email do cliente é obrigatório!');
      return;
    }
    if (this.currentClient.contractValue <= 0) {
      alert('Valor do contrato deve ser maior que zero!');
      return;
    }

    if (this.isEditingClient) {
      const index = this.activeClients.findIndex(c => c.id === this.currentClient.id);
      if (index !== -1) {
        this.activeClients[index] = {
          ...this.currentClient,
          statusText: this.getClientStatusText(this.currentClient.status)
        };
        this.addActivity(`Cliente "${this.currentClient.name}" foi atualizado`, 'client', 'icon-edit', 'updated', 'Atualizado');
      }
    } else {
      const newClient = {
        ...this.currentClient,
        id: Date.now(),
        statusText: this.getClientStatusText(this.currentClient.status)
      };
      this.activeClients.push(newClient);
      this.addActivity(`Novo cliente "${newClient.name}" foi adicionado`, 'client', 'icon-plus', 'created', 'Criado');
    }

    this.saveToLocalStorage();
  }

  deleteClient(client: any) {
    if (confirm(`Tem certeza que deseja excluir o cliente "${client.name}"?`)) {
      const index = this.activeClients.findIndex(c => c.id === client.id);
      if (index !== -1) {
        this.activeClients.splice(index, 1);
        this.addActivity(`Cliente "${client.name}" foi removido`, 'client', 'icon-delete', 'deleted', 'Removido');
        this.saveToLocalStorage();
      }
    }
  }

  private getClientStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Ativo',
      'pending': 'Pendente',
      'inactive': 'Inativo',
      'suspended': 'Suspenso'
    };
    return statusMap[status] || status;
  }

  getTotalContractValue(): number {
    return this.activeClients.reduce((sum, c) => sum + c.contractValue, 0);
  }

  getTotalActiveProjects(): number {
    return this.teamMembers.reduce((sum, m) => sum + m.activeProjects, 0);
  }

  getAverageEfficiency(): number {
    return Math.round(this.teamMembers.reduce((sum, m) => sum + m.efficiency, 0) / this.teamMembers.length);
  }

  // Financial Management
  refreshFinancials() {
    this.monthlyRevenue = Math.floor(Math.random() * 50000) + 150000;
    this.monthlyExpenses = Math.floor(Math.random() * 20000) + 50000;
    this.netProfit = this.monthlyRevenue - this.monthlyExpenses;
    this.pendingReceivables = Math.floor(Math.random() * 30000) + 30000;
    this.addActivity('Dados financeiros atualizados', 'analytics', 'icon-chart', 'updated', 'Atualizado');
  }

  exportFinancials() {
    const financialData = {
      monthlyRevenue: this.monthlyRevenue,
      monthlyExpenses: this.monthlyExpenses,
      netProfit: this.netProfit,
      pendingReceivables: this.pendingReceivables,
      pendingInvoices: this.pendingInvoices,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(financialData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeiro-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    this.addActivity('Relatório financeiro exportado', 'report', 'icon-export', 'exported', 'Exportado');
  }

  // Team Management
  manageTeam() {
    this.showTeamModal = true;
  }

  // Support
  async openChatSupport() {
    // Simular clique no ícone do chatbot
    setTimeout(() => {
      const chatbotIcon = document.querySelector('.chatbot-minimized');
      if (chatbotIcon) {
        (chatbotIcon as HTMLElement).click();
      }
    }, 100);
    this.addActivity('Chat ao vivo iniciado', 'support', 'icon-chat', 'opened', 'Aberto');
  }

  async sendSupportEmail() {
    const subject = 'Suporte Técnico - Dashboard';
    const body = `Olá,\n\nPreciso de ajuda com o sistema.\n\nUsuário: ${this.userName}\nData: ${new Date().toLocaleDateString()}\n\nDescreva seu problema aqui...\n\nAtenciosamente,\n${this.userName}`;
    
    const mailtoUrl = `mailto:contato@arsmachinaconsultancy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    
    this.addActivity('Email de suporte enviado', 'support', 'icon-mail', 'sent', 'Enviado');
  }

  callSupport() {
    window.open('https://wa.me/message/KNSHISJA3H25K1', '_blank');
    this.addActivity('Contato via WhatsApp iniciado', 'support', 'icon-phone', 'called', 'Chamado');
  }

  // Navigation
  navigateTo(section: string) {
    // Close all components first
    this.closeAllComponents();
    
    switch (section) {
      case 'profile':
        this.showProfileComponent = true;
        break;
      case 'settings':
        this.showSettingsComponent = true;
        break;
      case 'reports':
        this.showReportsComponent = true;
        break;
      case 'help':
        this.showHelpComponent = true;
        break;
      default:
        console.log(`Navegando para: ${section}`);
        break;
    }
  }
  
  closeAllComponents() {
    this.showProfileComponent = false;
    this.showSettingsComponent = false;
    this.showReportsComponent = false;
    this.showHelpComponent = false;
  }
  
  // Modal methods
  closeProfileModal() {
    this.showProfileModal = false;
  }
  
  closeSettingsModal() {
    this.showSettingsModal = false;
  }
  
  closeHelpModal() {
    this.showHelpModal = false;
  }
  
  // Component close methods
  closeProfileComponent() {
    this.showProfileComponent = false;
  }
  
  closeSettingsComponent() {
    this.showSettingsComponent = false;
  }
  
  closeReportsComponent() {
    this.showReportsComponent = false;
  }
  
  closeHelpComponent() {
    this.showHelpComponent = false;
  }
  
  async startEditingProfile() {
    await this.loadUserProfile();
    this.originalProfile = JSON.parse(JSON.stringify(this.userProfile));
    this.isEditingProfile = true;
  }
  
  cancelEditingProfile() {
    this.userProfile = JSON.parse(JSON.stringify(this.originalProfile));
    this.isEditingProfile = false;
  }
  
  async saveProfile() {
    if (!this.userProfile.name || !this.userProfile.email) {
      alert('Nome e email são obrigatórios!');
      return;
    }
    
    this.profileSaving = true;
    
    try {
      // Simular salvamento (aqui você integraria com AWS Cognito)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Salvar no localStorage como backup
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
      
      // Atualizar nome do usuário
      this.userName = this.userProfile.name;
      
      this.addActivity(`Perfil atualizado com sucesso`, 'profile', 'icon-user', 'updated', 'Atualizado');
      
      this.isEditingProfile = false;
      alert('Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      this.profileSaving = false;
    }
  }
  
  async loadUserProfile() {
    try {
      // Tentar carregar do localStorage primeiro
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
      }
      
      // Usar getCurrentUserName em vez de getCurrentUser
      const userName = await this.authService.getCurrentUserName();
      if (userName) {
        this.userProfile.name = this.userProfile.name || userName;
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }
  
  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeAvatar() {
    this.userProfile.avatar = '';
  }
  
  changeLanguage(event: any) {
    const newLang = event.target.value;
    this.translationService.setLanguage(newLang);
    this.addActivity(`Idioma alterado para ${newLang === 'pt' ? 'Português' : 'English'}`, 'settings', 'icon-settings', 'updated', 'Atualizado');
  }
  
  saveSettings() {
    this.addActivity('Configurações salvas', 'settings', 'icon-settings', 'saved', 'Salvo');
    this.closeSettingsModal();
    alert('Configurações salvas com sucesso!');
  }
  
  showGuide(type: string) {
    const guides: { [key: string]: string } = {
      'projects': 'Para criar um projeto:\n1. Clique em "Novo Projeto"\n2. Preencha os dados\n3. Defina prazo e equipe\n4. Clique em "Criar"',
      'tasks': 'Para gerenciar tarefas:\n1. Clique em "Nova Tarefa"\n2. Associe a um projeto\n3. Defina prioridade\n4. Acompanhe o progresso',
      'reports': 'Para gerar relatórios:\n1. Clique em "Gerar Relatório"\n2. Escolha o tipo\n3. O arquivo será baixado automaticamente'
    };
    alert(guides[type] || 'Guia não encontrado');
  }
  
  showFAQ(type: string) {
    const faqs: { [key: string]: string } = {
      'backup': 'Os dados são salvos automaticamente no navegador. Use "Exportar Dados" para backup completo.',
      'sharing': 'Use a função "Gerar Relatório" para compartilhar informações dos projetos.',
      'notifications': 'Acesse Configurações > Notificações para personalizar alertas.'
    };
    alert(faqs[type] || 'FAQ não encontrada');
  }
  
  watchTutorial(type: string) {
    alert(`Tutorial "${type}" será aberto em breve!`);
  }
  
  contactSupport() {
    this.closeHelpModal();
    this.sendSupportEmail();
  }

  // Analytics methods
  refreshAnalytics() {
    // Simulate refreshing analytics data
    this.productivityScore = Math.floor(Math.random() * 20) + 80; // Random between 80-100
    this.teamPerformance = Math.floor(Math.random() * 15) + 85; // Random between 85-100
    this.clientSatisfaction = Math.floor(Math.random() * 10) + 90; // Random between 90-100
    this.revenue = Math.floor(Math.random() * 50000) + 100000; // Random between 100k-150k

    // Add a new activity for analytics refresh
    this.addActivity('Analytics atualizados', 'analytics', 'icon-chart', 'success', 'Atualizado');
  }

  exportAnalytics() {
    // Simulate exporting analytics data
    const data = {
      productivityScore: this.productivityScore,
      teamPerformance: this.teamPerformance,
      clientSatisfaction: this.clientSatisfaction,
      revenue: this.revenue,
      exportDate: new Date().toISOString()
    };

    // Create and download a JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Add activity
    this.addActivity('Relatório de analytics exportado', 'report', 'icon-export', 'generated', 'Exportado');
  }

  // Data persistence
  private saveToLocalStorage() {
    const dashboardData = {
      activeProjects: this.activeProjects,
      tasks: this.tasks,
      meetings: this.meetings,
      userStats: this.userStats,
      recentActivities: this.recentActivities,
      notifications: this.notifications,
      activeClients: this.activeClients
    };
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
  }

  private loadFromLocalStorage() {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.activeProjects = data.activeProjects || this.activeProjects;
        this.tasks = data.tasks || [];
        this.meetings = data.meetings || [];
        this.userStats = { ...this.userStats, ...data.userStats };
        this.recentActivities = data.recentActivities || this.recentActivities;
        this.notifications = data.notifications || this.notifications;
        this.activeClients = data.activeClients || this.activeClients;
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }
  }

  // Filter and search methods
  get filteredProjects() {
    let filtered = this.activeProjects;
    
    if (this.projectFilter !== 'all') {
      filtered = filtered.filter(p => p.status === this.projectFilter);
    }
    
    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }
  
  get filteredTasks() {
    let filtered = this.tasks;
    
    if (this.taskFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (this.taskFilter === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    }
    
    if (this.searchTerm) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }
  
  // Meeting management
  openMeetingModal() {
    this.currentMeeting = {
      id: null,
      title: '',
      date: '',
      time: '',
      participants: '',
      description: ''
    };
    this.showMeetingModal = true;
  }
  
  closeMeetingModal() {
    this.showMeetingModal = false;
  }
  
  closeTeamModal() {
    this.showTeamModal = false;
  }
  

  
  saveMeeting() {
    if (!this.currentMeeting.title.trim()) {
      alert('Título da reunião é obrigatório!');
      return;
    }
    if (!this.currentMeeting.date) {
      alert('Data da reunião é obrigatória!');
      return;
    }
    if (!this.currentMeeting.time) {
      alert('Horário da reunião é obrigatório!');
      return;
    }

    const meeting = {
      ...this.currentMeeting,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      participants: this.currentMeeting.participants.split(',').map((p: string) => p.trim())
    };
    
    this.meetings.push(meeting);
    this.addActivity(`Reunião "${meeting.title}" agendada para ${meeting.date}`, 'meeting', 'icon-calendar', 'scheduled', 'Agendada');
    
    this.closeMeetingModal();
    this.saveToLocalStorage();
  }
  
  // Task completion toggle
  toggleTaskCompletion(task: any) {
    task.completed = !task.completed;
    const status = task.completed ? 'concluída' : 'reaberta';
    this.addActivity(`Tarefa "${task.title}" foi ${status}`, 'task', 'icon-check', task.completed ? 'completed' : 'reopened', status.charAt(0).toUpperCase() + status.slice(1));
    this.updateTaskStats();
    this.saveToLocalStorage();
  }
  
  // Project progress update
  updateProjectProgress(project: any, newProgress: number) {
    project.progress = Math.max(0, Math.min(100, newProgress));
    this.addActivity(`Progresso do projeto "${project.name}" atualizado para ${project.progress}%`, 'project', 'icon-chart', 'updated', 'Atualizado');
    this.saveToLocalStorage();
  }
  
  // Bulk operations
  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveToLocalStorage();
  }
  
  clearAllNotifications() {
    if (confirm('Tem certeza que deseja limpar todas as notificações?')) {
      this.notifications = [];
      this.saveToLocalStorage();
    }
  }
  
  // Data export/import
  exportAllData() {
    const allData = {
      activeProjects: this.activeProjects,
      tasks: this.tasks,
      meetings: this.meetings,
      userStats: this.userStats,
      recentActivities: this.recentActivities,
      notifications: this.notifications,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    this.addActivity('Backup completo dos dados exportado', 'report', 'icon-export', 'exported', 'Exportado');
  }
  
  // Statistics calculations
  get projectStats() {
    const total = this.activeProjects.length;
    const inProgress = this.activeProjects.filter(p => p.status === 'in-progress').length;
    const completed = this.activeProjects.filter(p => p.status === 'completed').length;
    const planning = this.activeProjects.filter(p => p.status === 'planning').length;
    
    return { total, inProgress, completed, planning };
  }
  
  get taskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending, completionRate };
  }
  
  // Helper method to get status text
  private getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'planning': 'Planejamento',
      'in-progress': 'Em Andamento',
      'review': 'Em Revisão',
      'completed': 'Concluído'
    };
    return statusMap[status] || status;
  }

  // Helper method to add activities
  private applyUserSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Aplicar animações
    if (settings.dashboard?.showAnimations !== false) {
      document.body.classList.add('animations-enabled');
    }
    
    // Aplicar modo compacto
    if (settings.dashboard?.compactMode) {
      document.body.classList.add('compact-mode');
    }
  }
  
  private setupAutoRefresh() {
    const refreshConfig = JSON.parse(localStorage.getItem('dashboardAutoRefresh') || '{}');
    
    if (refreshConfig.enabled && refreshConfig.interval) {
      setInterval(() => {
        this.refreshAnalytics();
        this.loadFromLocalStorage();
      }, refreshConfig.interval);
    }
  }

  private addActivity(text: string, type: string, icon: string, status: string, statusText: string) {
    const newActivity = {
      type: type,
      icon: icon,
      text: text,
      time: 'Agora',
      status: status,
      statusText: statusText
    };

    this.recentActivities.unshift(newActivity);

    // Keep only the last 10 activities
    if (this.recentActivities.length > 10) {
      this.recentActivities = this.recentActivities.slice(0, 10);
    }
    
    this.saveToLocalStorage();
  }
}
