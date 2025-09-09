import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  searchTerm = '';
  statusFilter = 'all';
  sortBy = 'name';
  sortOrder = 'asc';
  Math = Math;

  constructor(
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.applyFilters();
  }

  loadProjects() {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.projects = data.activeProjects || this.getDefaultProjects();
    } else {
      this.projects = this.getDefaultProjects();
    }
  }

  getDefaultProjects() {
    return [
      {
        id: 1,
        name: 'Sistema de Gestão Empresarial',
        description: 'Sistema completo de gestão empresarial com módulos financeiro, RH e vendas',
        status: 'in-progress',
        statusText: 'Em Andamento',
        progress: 75,
        deadline: '2024-12-15',
        teamSize: 8,
        priority: 'high',
        client: 'TechCorp Solutions',
        budget: 150000,
        startDate: '2024-08-01'
      },
      {
        id: 2,
        name: 'Aplicativo Mobile E-commerce',
        description: 'Aplicativo mobile para vendas online com integração de pagamentos',
        status: 'review',
        statusText: 'Em Revisão',
        progress: 90,
        deadline: '2024-12-20',
        teamSize: 5,
        priority: 'high',
        client: 'InnovateHub',
        budget: 85000,
        startDate: '2024-09-15'
      },
      {
        id: 3,
        name: 'Plataforma de Análise de Dados',
        description: 'Dashboard analítico com visualizações interativas e relatórios',
        status: 'planning',
        statusText: 'Planejamento',
        progress: 25,
        deadline: '2025-01-10',
        teamSize: 6,
        priority: 'medium',
        client: 'DataFlow Systems',
        budget: 120000,
        startDate: '2024-11-01'
      },
      {
        id: 4,
        name: 'Sistema de CRM Avançado',
        description: 'Plataforma de relacionamento com cliente com automação de marketing',
        status: 'completed',
        statusText: 'Concluído',
        progress: 100,
        deadline: '2024-11-30',
        teamSize: 4,
        priority: 'medium',
        client: 'SalesForce Pro',
        budget: 95000,
        startDate: '2024-07-01'
      },
      {
        id: 5,
        name: 'Portal de Educação Online',
        description: 'Plataforma de ensino à distância com videoconferência integrada',
        status: 'in-progress',
        statusText: 'Em Andamento',
        progress: 60,
        deadline: '2025-02-28',
        teamSize: 7,
        priority: 'high',
        client: 'EduTech Solutions',
        budget: 180000,
        startDate: '2024-10-01'
      },
      {
        id: 6,
        name: 'Sistema de Logística Inteligente',
        description: 'Otimização de rotas e gestão de frota com IA',
        status: 'planning',
        statusText: 'Planejamento',
        progress: 15,
        deadline: '2025-03-15',
        teamSize: 5,
        priority: 'low',
        client: 'LogiSmart',
        budget: 110000,
        startDate: '2024-12-01'
      }
    ];
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           project.client.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || project.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    this.sortProjects();
  }

  sortProjects() {
    this.filteredProjects.sort((a, b) => {
      let valueA = a[this.sortBy];
      let valueB = b[this.sortBy];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (this.sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.sortProjects();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortProjects();
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'planning': 'status-planning',
      'in-progress': 'status-in-progress',
      'review': 'status-review',
      'completed': 'status-completed'
    };
    return statusClasses[status] || '';
  }

  getPriorityClass(priority: string): string {
    const priorityClasses: { [key: string]: string } = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high'
    };
    return priorityClasses[priority] || '';
  }

  viewProject(project: any) {
    alert(`Visualizando projeto: ${project.name}\n\nDescrição: ${project.description}\nStatus: ${project.statusText}\nProgresso: ${project.progress}%\nPrazo: ${project.deadline}\nCliente: ${project.client}\nOrçamento: R$ ${project.budget.toLocaleString('pt-BR')}`);
  }

  editProject(project: any) {
    alert(`Editando projeto: ${project.name}\n\nFuncionalidade em desenvolvimento...`);
  }

  deleteProject(project: any) {
    if (confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
      const index = this.projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        this.projects.splice(index, 1);
        this.saveProjects();
        this.applyFilters();
        alert('Projeto excluído com sucesso!');
      }
    }
  }

  saveProjects() {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      const data = JSON.parse(savedData);
      data.activeProjects = this.projects;
      localStorage.setItem('dashboardData', JSON.stringify(data));
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }

  getProjectStats() {
    const total = this.filteredProjects.length;
    const completed = this.filteredProjects.filter(p => p.status === 'completed').length;
    const inProgress = this.filteredProjects.filter(p => p.status === 'in-progress').length;
    const planning = this.filteredProjects.filter(p => p.status === 'planning').length;
    const review = this.filteredProjects.filter(p => p.status === 'review').length;
    
    const totalBudget = this.filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const avgProgress = total > 0 ? Math.round(this.filteredProjects.reduce((sum, p) => sum + p.progress, 0) / total) : 0;
    
    return {
      total,
      completed,
      inProgress,
      planning,
      review,
      totalBudget,
      avgProgress,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  get inProgressCount(): number {
    return this.filteredProjects.filter(p => p.status === 'in-progress').length;
  }

  get completedCount(): number {
    return this.filteredProjects.filter(p => p.status === 'completed').length;
  }

  get totalBudgetFormatted(): string {
    const total = this.filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    return (total / 1000).toFixed(0);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  getDaysUntilDeadline(deadline: string): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDeadlineStatus(deadline: string): string {
    const days = this.getDaysUntilDeadline(deadline);
    if (days < 0) return 'overdue';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return 'normal';
  }



  exportProjects() {
    const csvContent = this.generateProjectsCSV();
    this.downloadFile(csvContent, `projetos-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  }

  generateProjectsCSV(): string {
    const headers = ['Nome', 'Descrição', 'Status', 'Progresso (%)', 'Prazo', 'Cliente', 'Orçamento', 'Equipe', 'Prioridade'];
    const rows = this.filteredProjects.map(p => 
      `"${p.name}","${p.description}","${p.statusText}",${p.progress},"${p.deadline}","${p.client}",${p.budget},${p.teamSize},"${p.priority}"`
    );
    
    return [headers.join(','), ...rows].join('\n');
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
}