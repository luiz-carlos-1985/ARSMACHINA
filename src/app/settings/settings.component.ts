import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';
import { AuthService } from '../auth.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings = {
    language: 'pt',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      desktop: false,
      sound: true,
      projects: true,
      tasks: false,
      reports: true
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      emailVisible: false,
      shareData: false
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: 30,
      showAnimations: true,
      compactMode: false,
      defaultView: 'overview'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 60,
      loginAlerts: true,
      passwordExpiry: 90
    },
    advanced: {
      debugMode: false,
      betaFeatures: false,
      dataCollection: true
    }
  };

  activeTab = 'general';
  hasChanges = false;
  isSaving = false;

  get availableLanguages() {
    return this.translationService.getAvailableLanguages().map(lang => ({
      ...lang,
      flag: lang.code === 'pt' ? '🇧🇷' : '🇺🇸'
    }));
  }
  
  get availableThemes() {
    return [
      { value: 'light', name: this.getTranslation('theme.light') || 'Claro', icon: '☀️' },
      { value: 'dark', name: this.getTranslation('theme.dark') || 'Escuro', icon: '🌙' },
      { value: 'auto', name: this.getTranslation('theme.auto') || 'Automático', icon: '🌍' }
    ];
  }

  constructor(
    private translationService: TranslationService,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadSettings();
    // Sync with theme service
    this.settings.theme = this.themeService.getCurrentTheme();
    // Sync with translation service
    this.settings.language = this.translationService.getCurrentLanguage();
    
    // Subscribe to language changes
    this.translationService.currentLanguage$.subscribe(lang => {
      console.log('Settings: Language changed to:', lang);
    });
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  async saveSettings() {
    this.isSaving = true;
    
    try {
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
      this.hasChanges = false;
      
      // Aplicar todas as configurações
      if (this.settings.language) {
        this.translationService.setLanguage(this.settings.language);
      }
      
      this.applyTheme();
      this.applyNotificationSettings();
      this.applyDashboardSettings();
      this.applySecuritySettings();
      this.applyPrivacySettings();
      
      // Adicionar atividade no dashboard
      this.addDashboardActivity('Configurações atualizadas');
      
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      this.isSaving = false;
    }
  }
  
  private applyTheme() {
    if (this.settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeService.setTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.themeService.setTheme(this.settings.theme);
    }
  }
  
  private addDashboardActivity(text: string) {
    const dashboardData = JSON.parse(localStorage.getItem('dashboardData') || '{}');
    if (!dashboardData.recentActivities) {
      dashboardData.recentActivities = [];
    }
    
    dashboardData.recentActivities.unshift({
      type: 'settings',
      icon: 'icon-settings',
      text: text,
      time: 'Agora',
      status: 'updated',
      statusText: 'Atualizado'
    });
    
    if (dashboardData.recentActivities.length > 10) {
      dashboardData.recentActivities = dashboardData.recentActivities.slice(0, 10);
    }
    
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
  }

  resetSettings() {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      this.settings = {
        language: 'pt',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          desktop: false,
          sound: true,
          projects: true,
          tasks: false,
          reports: true
        },
        privacy: {
          profileVisible: true,
          activityVisible: false,
          emailVisible: false,
          shareData: false
        },
        dashboard: {
          autoRefresh: true,
          refreshInterval: 30,
          showAnimations: true,
          compactMode: false,
          defaultView: 'overview'
        },
        security: {
          twoFactor: false,
          sessionTimeout: 60,
          loginAlerts: true,
          passwordExpiry: 90
        },
        advanced: {
          debugMode: false,
          betaFeatures: false,
          dataCollection: true
        }
      };
      this.hasChanges = true;
    }
  }

  onSettingChange() {
    this.hasChanges = true;
  }
  
  onLanguageChange() {
    this.hasChanges = true;
    this.translationService.setLanguage(this.settings.language);
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
    this.addDashboardActivity(`Idioma alterado para ${this.settings.language === 'pt' ? 'Português' : 'English'}`);
  }
  
  onThemeChange() {
    this.hasChanges = true;
    this.applyTheme();
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
  }
  
  onNotificationChange() {
    this.hasChanges = true;
    this.applyNotificationSettings();
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
  }
  
  onDashboardChange() {
    this.hasChanges = true;
    this.applyDashboardSettings();
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
  }
  
  onPrivacyChange() {
    this.hasChanges = true;
    this.applyPrivacySettings();
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
  }
  
  onSecurityChange() {
    this.hasChanges = true;
    this.applySecuritySettings();
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
  }
  
  private applyNotificationSettings() {
    if ('Notification' in window && this.settings.notifications.desktop) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
    
    // Aplicar configurações de som
    if (this.settings.notifications.sound) {
      document.body.classList.add('notifications-sound-enabled');
    } else {
      document.body.classList.remove('notifications-sound-enabled');
    }
  }
  
  private applyDashboardSettings() {
    // Aplicar animações
    if (this.settings.dashboard.showAnimations) {
      document.body.classList.add('animations-enabled');
    } else {
      document.body.classList.remove('animations-enabled');
    }
    
    // Aplicar modo compacto
    if (this.settings.dashboard.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
    
    // Configurar auto-refresh se estiver no dashboard
    this.setupAutoRefresh();
  }
  
  private setupAutoRefresh() {
    if (this.settings.dashboard.autoRefresh) {
      const interval = this.settings.dashboard.refreshInterval * 1000;
      localStorage.setItem('dashboardAutoRefresh', JSON.stringify({
        enabled: true,
        interval: interval
      }));
    } else {
      localStorage.removeItem('dashboardAutoRefresh');
    }
  }
  
  private applySecuritySettings() {
    // Configurar timeout da sessão
    if (this.settings.security.sessionTimeout) {
      const timeout = this.settings.security.sessionTimeout * 60 * 1000;
      localStorage.setItem('sessionTimeout', timeout.toString());
      
      // Configurar timer de logout automático
      setTimeout(() => {
        if (confirm('Sua sessão expirou. Deseja continuar?')) {
          this.applySecuritySettings(); // Reiniciar timer
        } else {
          this.authService.signOut();
        }
      }, timeout);
    }
  }
  
  private applyPrivacySettings() {
    // Aplicar configurações de privacidade
    const privacyClass = this.settings.privacy.profileVisible ? 'profile-public' : 'profile-private';
    document.body.classList.remove('profile-public', 'profile-private');
    document.body.classList.add(privacyClass);
    
    // Configurar coleta de dados
    if (!this.settings.privacy.shareData) {
      localStorage.setItem('dataCollectionDisabled', 'true');
    } else {
      localStorage.removeItem('dataCollectionDisabled');
    }
  }
  
  previewTheme(theme: string) {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeService.setTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.themeService.setTheme(theme);
    }
  }
  
  getStorageUsage(): string {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    return (totalSize / 1024).toFixed(2) + ' KB';
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  exportSettings() {
    const friendlyData = {
      "Informações do Backup": {
        "Data de Exportação": new Date().toLocaleDateString('pt-BR'),
        "Hora de Exportação": new Date().toLocaleTimeString('pt-BR'),
        "Versão": "1.0",
        "Aplicação": "Ars Machina Consultancy"
      },
      "Configurações Gerais": {
        "Idioma": this.settings.language === 'pt' ? 'Português' : 'English',
        "Tema": this.getThemeName(this.settings.theme)
      },
      "Notificações": {
        "Email": this.settings.notifications.email ? 'Ativado' : 'Desativado',
        "Push": this.settings.notifications.push ? 'Ativado' : 'Desativado',
        "Desktop": this.settings.notifications.desktop ? 'Ativado' : 'Desativado',
        "Sons": this.settings.notifications.sound ? 'Ativado' : 'Desativado',
        "Projetos": this.settings.notifications.projects ? 'Ativado' : 'Desativado',
        "Tarefas": this.settings.notifications.tasks ? 'Ativado' : 'Desativado'
      },
      "_configuracoes_tecnicas": this.settings
    };
    
    const dataStr = JSON.stringify(friendlyData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `configuracoes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Configurações exportadas com sucesso!');
  }

  importSettings(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Verificar se é um arquivo exportado pelo sistema
          if (importedData._configuracoes_tecnicas) {
            this.settings = { ...this.settings, ...importedData._configuracoes_tecnicas };
          } else {
            // Arquivo de configurações diretas
            this.settings = { ...this.settings, ...importedData };
          }
          
          this.hasChanges = true;
          alert('Configurações importadas com sucesso!');
          this.addDashboardActivity('Configurações importadas de arquivo');
        } catch (error) {
          alert('Erro ao importar configurações. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
  }

  clearCache() {
    if (confirm('Isso irá limpar todos os dados em cache. Continuar?')) {
      const keysToRemove = ['dashboardData', 'userProfile', 'generatedReports'];
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      this.addDashboardActivity('Cache do sistema limpo');
      alert('Cache limpo com sucesso!');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  
  testNotifications() {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Teste de Notificação', {
          body: 'As notificações estão funcionando corretamente!',
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Teste de Notificação', {
              body: 'As notificações estão funcionando corretamente!',
              icon: '/favicon.ico'
            });
          }
        });
      }
    } else {
      alert('Seu navegador não suporta notificações.');
    }
  }
  
  exportAllData() {
    const allData = {
      settings: this.settings,
      profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
      dashboard: JSON.parse(localStorage.getItem('dashboardData') || '{}'),
      reports: JSON.parse(localStorage.getItem('generatedReports') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-completo-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    this.addDashboardActivity('Backup completo exportado');
  }
  
  importAllData(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (importedData.settings) {
            this.settings = { ...this.settings, ...importedData.settings };
            this.hasChanges = true;
          }
          
          if (importedData.profile) {
            localStorage.setItem('userProfile', JSON.stringify(importedData.profile));
          }
          
          if (importedData.dashboard) {
            localStorage.setItem('dashboardData', JSON.stringify(importedData.dashboard));
          }
          
          if (importedData.reports) {
            localStorage.setItem('generatedReports', JSON.stringify(importedData.reports));
          }
          
          alert('Dados importados com sucesso!');
          this.addDashboardActivity('Backup importado');
        } catch (error) {
          alert('Erro ao importar dados. Verifique o arquivo.');
        }
      };
      reader.readAsText(file);
    }
  }

  getTranslation(key: string): string {
    const translation = this.translationService.translate(key);
    // Debug: log if translation is missing
    if (translation === key) {
      console.warn(`Translation missing for key: ${key}`);
    }
    return translation;
  }

  getThemeName(theme: string): string {
    const themes: { [key: string]: string } = {
      'light': 'Claro',
      'dark': 'Escuro',
      'auto': 'Automático'
    };
    return themes[theme] || theme;
  }

  getViewName(view: string): string {
    const views: { [key: string]: string } = {
      'overview': 'Visão Geral',
      'projects': 'Projetos',
      'tasks': 'Tarefas',
      'analytics': 'Analytics'
    };
    return views[view] || view;
  }
}