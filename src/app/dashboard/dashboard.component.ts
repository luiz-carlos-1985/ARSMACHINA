import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationService } from '../translation.service';
import { AuthService } from '../auth.service';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
      name: 'Sistema de Gestão Empresarial',
      status: 'in-progress',
      statusText: 'Em Andamento',
      progress: 75,
      deadline: '15 Dez 2024',
      teamSize: 8
    },
    {
      name: 'Aplicativo Mobile E-commerce',
      status: 'review',
      statusText: 'Em Revisão',
      progress: 90,
      deadline: '20 Dez 2024',
      teamSize: 5
    },
    {
      name: 'Plataforma de Análise de Dados',
      status: 'planning',
      statusText: 'Planejamento',
      progress: 25,
      deadline: '10 Jan 2025',
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
  }

  private initializeLanguageSubscription() {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }

  // Quick Actions
  createNewProject() {
    // TODO: Implement actual create new project logic
    alert('Funcionalidade: Criar Novo Projeto\nEm breve disponível!');
  }

  addNewTask() {
    // TODO: Implement actual add new task logic
    alert('Funcionalidade: Adicionar Nova Tarefa\nEm breve disponível!');
  }

  scheduleMeeting() {
    // TODO: Implement actual schedule meeting logic
    alert('Funcionalidade: Agendar Reunião\nEm breve disponível!');
  }

  generateReport() {
    // TODO: Implement actual generate report logic
    alert('Funcionalidade: Gerar Relatório\nEm breve disponível!');
  }

  // Activities
  viewAllActivities() {
    alert('Funcionalidade: Ver Todas as Atividades\nEm breve disponível!');
  }

  // Notifications
  markAsRead(notification: any) {
    notification.read = true;
  }

  dismissNotification(notification: any) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  viewAllNotifications() {
    alert('Funcionalidade: Ver Todas as Notificações\nEm breve disponível!');
  }

  // Projects
  manageProjects() {
    alert('Funcionalidade: Gerenciar Projetos\nEm breve disponível!');
  }

  openProjectMenu(project: any) {
    alert(`Menu do projeto: ${project.name}\nFuncionalidade em desenvolvimento!`);
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

  // Project methods
  viewProjectDetails(project: any) {
    // Navigate to project details page or open modal
    console.log(`Visualizando detalhes do projeto: ${project.name}`);
    // TODO: Implement project details view
    alert(`Visualizando detalhes do projeto: ${project.name}`);
  }

  editProject(project: any) {
    // Navigate to project edit page or open edit modal
    console.log(`Editando projeto: ${project.name}`);
    // TODO: Implement project editing
    alert(`Editando projeto: ${project.name}`);
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
  }
}
