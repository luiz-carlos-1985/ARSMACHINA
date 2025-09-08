import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile = {
    name: '',
    email: '',
    phone: '',
    company: 'Ars Machina Consultancy',
    position: '',
    bio: '',
    avatar: '',
    joinDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    notifications: {
      email: true,
      projects: true,
      tasks: false
    }
  };

  isEditing = false;
  isSaving = false;
  originalProfile: any = {};
  userStats = {
    projects: 12,
    tasks: 45,
    completed: 38,
    productivity: 87
  };

  constructor(
    private authService: AuthService,
    private translationService: TranslationService
  ) {}

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      // Carregar do localStorage primeiro
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
      }
      
      // Carregar nome do usuário do AuthService
      const userName = await this.authService.getCurrentUserName();
      if (userName && !this.userProfile.name) {
        this.userProfile.name = userName;
      }
      
      // Carregar estatísticas do localStorage
      const dashboardData = localStorage.getItem('dashboardData');
      if (dashboardData) {
        const data = JSON.parse(dashboardData);
        this.userStats = {
          projects: data.activeProjects?.length || 12,
          tasks: data.tasks?.length || 45,
          completed: data.tasks?.filter((t: any) => t.completed).length || 38,
          productivity: 87
        };
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  startEditing() {
    this.originalProfile = JSON.parse(JSON.stringify(this.userProfile));
    this.isEditing = true;
  }

  cancelEditing() {
    this.userProfile = JSON.parse(JSON.stringify(this.originalProfile));
    this.isEditing = false;
  }

  async saveProfile() {
    if (!this.userProfile.name || !this.userProfile.email) {
      alert('Nome e email são obrigatórios!');
      return;
    }
    
    this.isSaving = true;
    
    try {
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Salvar no localStorage
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
      
      // Adicionar atividade no dashboard
      this.addDashboardActivity('Perfil atualizado com sucesso');
      
      this.isEditing = false;
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      this.isSaving = false;
    }
  }
  
  private addDashboardActivity(text: string) {
    const dashboardData = JSON.parse(localStorage.getItem('dashboardData') || '{}');
    if (!dashboardData.recentActivities) {
      dashboardData.recentActivities = [];
    }
    
    dashboardData.recentActivities.unshift({
      type: 'profile',
      icon: 'icon-user',
      text: text,
      time: 'Agora',
      status: 'updated',
      statusText: 'Atualizado'
    });
    
    // Manter apenas os últimos 10
    if (dashboardData.recentActivities.length > 10) {
      dashboardData.recentActivities = dashboardData.recentActivities.slice(0, 10);
    }
    
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tamanho (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }
      
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Apenas arquivos de imagem são permitidos.');
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
  
  exportProfile() {
    const dataStr = JSON.stringify(this.userProfile, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'perfil-usuario.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    this.addDashboardActivity('Perfil exportado');
  }
  
  importProfile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const importedProfile = JSON.parse(e.target.result);
          this.userProfile = { ...this.userProfile, ...importedProfile };
          alert('Perfil importado com sucesso!');
          this.addDashboardActivity('Perfil importado');
        } catch (error) {
          alert('Erro ao importar perfil. Verifique o arquivo.');
        }
      };
      reader.readAsText(file);
    }
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
}