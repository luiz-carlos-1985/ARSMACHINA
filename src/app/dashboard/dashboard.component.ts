import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentLanguage = 'pt';

  // User data
  userName = 'João Silva';
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
      time: '2 horas atrás'
    },
    {
      type: 'task',
      icon: 'icon-check',
      text: 'Tarefa "Revisão de código" foi concluída',
      time: '4 horas atrás'
    },
    {
      type: 'meeting',
      icon: 'icon-calendar',
      text: 'Reunião com cliente agendada para amanhã',
      time: '6 horas atrás'
    },
    {
      type: 'report',
      icon: 'icon-chart',
      text: 'Relatório mensal gerado com sucesso',
      time: '1 dia atrás'
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

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.initializeLanguageSubscription();
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
    alert('Funcionalidade: Criar Novo Projeto\nEm breve disponível!');
  }

  addNewTask() {
    alert('Funcionalidade: Adicionar Nova Tarefa\nEm breve disponível!');
  }

  scheduleMeeting() {
    alert('Funcionalidade: Agendar Reunião\nEm breve disponível!');
  }

  generateReport() {
    alert('Funcionalidade: Gerar Relatório\nEm breve disponível!');
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

  // Navigation
  navigateTo(section: string) {
    alert(`Navegando para: ${section}\nFuncionalidade em desenvolvimento!`);
  }
}
