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

  availableLanguages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];
  
  availableThemes = [
    { value: 'light', name: 'Claro', icon: '☀️' },
    { value: 'dark', name: 'Escuro', icon: '🌙' },
    { value: 'auto', name: 'Automático', icon: '🌍' }
  ];

  constructor(
    private translationService: TranslationService,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadSettings();
    // Sync with theme service
    this.settings.theme = this.themeService.getCurrentTheme();
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
      
      // Aplicar mudanças de idioma
      if (this.settings.language) {
        this.translationService.setLanguage(this.settings.language);
      }
      
      // Aplicar tema
      this.applyTheme();
      
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
    const dataStr = JSON.stringify(this.settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracoes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  importSettings(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          this.settings = { ...this.settings, ...importedSettings };
          this.hasChanges = true;
          alert('Configurações importadas com sucesso!');
        } catch (error) {
          alert('Erro ao importar configurações. Verifique o arquivo.');
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
    return this.translationService.translate(key);
  }
}