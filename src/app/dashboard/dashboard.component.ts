import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService } from '../translation.service';
import { AuthService } from '../auth.service';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentLanguage = 'pt';

  // User data
  userName = 'Usuário';

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

  // Modal states
  showProjectModal = false;
  showTaskModal = false;
  isEditingProject = false;
  isEditingTask = false;

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

  async ngOnInit() {
    this.initializeLanguageSubscription();
    this.userName = await this.authService.getCurrentUserName();
    this.loadFromLocalStorage();
    this.updateTaskStats();
  }

  private initializeLanguageSubscription() {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
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
    // TODO: Implement actual schedule meeting logic
    alert('Funcionalidade: Agendar Reunião\nEm breve disponível!');
  }

  generateReport() {
    // TODO: Implement actual generate report logic
    alert('Funcionalidade: Gerar Relatório\nEm breve disponível!');
  }

  // Project Management
  saveProject() {
    if (this.isEditingProject) {
      // Update existing project
      const index = this.activeProjects.findIndex(p => p.id === this.currentProject.id);
      if (index !== -1) {
        this.activeProjects[index] = { ...this.currentProject };
        this.addActivity(`Projeto "${this.currentProject.name}" foi atualizado`, 'project', 'icon-edit', 'updated', 'Atualizado');
      }
    } else {
      // Create new project
      const newProject = {
        ...this.currentProject,
        id: Date.now(), // Simple ID generation
        progress: 0
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
    alert('Funcionalidade: Ver Todas as Atividades\nEm breve disponível!');
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
    alert('Funcionalidade: Ver Todas as Notificações\nEm breve disponível!');
  }

  // Projects
  manageProjects() {
    // Navigate to a dedicated projects page or show all projects
    console.log('Managing all projects');
    // For now, just show an alert with project count
    alert(`Você tem ${this.activeProjects.length} projetos ativos.\nFuncionalidade completa em desenvolvimento.`);
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

  // Support
  async openChatSupport() {
    // Navigate to chatbot component
    this.router.navigate(['/chatbot']);
  }

  async sendSupportEmail() {
    try {
      const userEmail = await this.authService.getCurrentUserName() + '@example.com'; // This is a placeholder
      const subject = 'Suporte Técnico - Dashboard';
      const message = `Olá,\n\nPreciso de ajuda com o sistema.\n\nAtenciosamente,\n${this.userName}`;

      // Use sendWelcomeEmail as a placeholder for sending support email
      await this.emailService.sendWelcomeEmail(userEmail, this.userName);

      // Add activity
      this.addActivity('Email de suporte enviado', 'support', 'icon-mail', 'sent', 'Enviado');

      alert('Email de suporte enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar email de suporte:', error);
      alert('Erro ao enviar email de suporte. Tente novamente.');
    }
  }

  callSupport() {
    // Simulate calling support
    const supportNumber = '+55 11 99999-9999';
    window.open(`tel:${supportNumber}`, '_self');

    // Add activity
    this.addActivity('Chamada para suporte iniciada', 'support', 'icon-phone', 'called', 'Chamado');
  }

  // Navigation
  navigateTo(section: string) {
    switch (section) {
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'settings':
        this.router.navigate(['/settings']);
        break;
      case 'reports':
        this.router.navigate(['/reports']);
        break;
      case 'help':
        this.router.navigate(['/help']);
        break;
      default:
        console.log(`Navegando para: ${section}`);
        break;
    }
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
      userStats: this.userStats,
      recentActivities: this.recentActivities,
      notifications: this.notifications
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
        this.userStats = { ...this.userStats, ...data.userStats };
        this.recentActivities = data.recentActivities || this.recentActivities;
        this.notifications = data.notifications || this.notifications;
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }
  }

  // Helper method to add activities
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
