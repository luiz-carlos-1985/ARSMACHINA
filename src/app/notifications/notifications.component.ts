import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  filteredNotifications: any[] = [];
  searchTerm = '';
  typeFilter = 'all';
  statusFilter = 'all';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadNotifications();
    this.applyFilters();
  }

  loadNotifications() {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.notifications = data.notifications || this.getDefaultNotifications();
    } else {
      this.notifications = this.getDefaultNotifications();
    }
  }

  getDefaultNotifications() {
    return [
      {
        id: 1,
        type: 'warning',
        text: 'Prazo do projeto "Sistema ERP" se aproxima',
        time: '1 hora atrás',
        read: false
      },
      {
        id: 2,
        type: 'info',
        text: 'Nova versão do sistema disponível',
        time: '3 horas atrás',
        read: false
      },
      {
        id: 3,
        type: 'success',
        text: 'Backup automático concluído com sucesso',
        time: '6 horas atrás',
        read: true
      }
    ];
  }

  applyFilters() {
    this.filteredNotifications = this.notifications.filter(notification => {
      const matchesSearch = notification.text.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.typeFilter === 'all' || notification.type === this.typeFilter;
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'read' && notification.read) ||
        (this.statusFilter === 'unread' && !notification.read);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onTypeFilterChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  markAsRead(notification: any) {
    notification.read = true;
    this.saveNotifications();
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.applyFilters();
  }

  deleteNotification(notification: any) {
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
      this.applyFilters();
    }
  }

  saveNotifications() {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
      const data = JSON.parse(savedData);
      data.notifications = this.notifications;
      localStorage.setItem('dashboardData', JSON.stringify(data));
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'warning': '⚠️',
      'info': 'ℹ️',
      'success': '✅',
      'error': '❌'
    };
    return icons[type] || 'ℹ️';
  }

  get unreadCount() {
    return this.filteredNotifications.filter(n => !n.read).length;
  }

  get totalCount() {
    return this.filteredNotifications.length;
  }

  clearFilters() {
    this.searchTerm = '';
    this.typeFilter = 'all';
    this.statusFilter = 'all';
    this.applyFilters();
  }
}