import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  activities: any[] = [];
  filteredActivities: any[] = [];
  searchTerm = '';
  typeFilter = 'all';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadActivities();
    this.applyFilters();
  }

  loadActivities() {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.activities = data.recentActivities || this.getDefaultActivities();
    } else {
      this.activities = this.getDefaultActivities();
    }
  }

  getDefaultActivities() {
    return [
      {
        id: 1,
        type: 'project',
        text: 'Novo projeto "Sistema ERP" foi criado',
        time: '2 horas atrás',
        status: 'success',
        statusText: 'Criado'
      },
      {
        id: 2,
        type: 'task',
        text: 'Tarefa "Revisão de código" foi concluída',
        time: '4 horas atrás',
        status: 'completed',
        statusText: 'Concluída'
      },
      {
        id: 3,
        type: 'meeting',
        text: 'Reunião com cliente agendada para amanhã',
        time: '6 horas atrás',
        status: 'scheduled',
        statusText: 'Agendada'
      },
      {
        id: 4,
        type: 'report',
        text: 'Relatório mensal gerado com sucesso',
        time: '1 dia atrás',
        status: 'generated',
        statusText: 'Gerado'
      }
    ];
  }

  applyFilters() {
    this.filteredActivities = this.activities.filter(activity => {
      const matchesSearch = activity.text.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.typeFilter === 'all' || activity.type === this.typeFilter;
      return matchesSearch && matchesType;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onTypeFilterChange() {
    this.applyFilters();
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'project': '📁',
      'task': '✅',
      'meeting': '📅',
      'report': '📊'
    };
    return icons[type] || '📋';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  get projectCount() {
    return this.filteredActivities.filter(a => a.type === 'project').length;
  }

  get taskCount() {
    return this.filteredActivities.filter(a => a.type === 'task').length;
  }

  get meetingCount() {
    return this.filteredActivities.filter(a => a.type === 'meeting').length;
  }

  clearFilters() {
    this.searchTerm = '';
    this.typeFilter = 'all';
    this.applyFilters();
  }
}