import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserStats {
  projects: number;
  tasks: number;
  completed: number;
}

export interface Analytics {
  productivityScore: number;
  teamPerformance: number;
  clientSatisfaction: number;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private userStatsSubject = new BehaviorSubject<UserStats>({
    projects: 12,
    tasks: 45,
    completed: 38
  });

  private analyticsSubject = new BehaviorSubject<Analytics>({
    productivityScore: 87,
    teamPerformance: 92,
    clientSatisfaction: 94,
    revenue: 125000
  });

  constructor() {
    this.loadFromStorage();
  }

  get userStats$(): Observable<UserStats> {
    return this.userStatsSubject.asObservable();
  }

  get analytics$(): Observable<Analytics> {
    return this.analyticsSubject.asObservable();
  }

  getUserStats(): UserStats {
    return this.userStatsSubject.value;
  }

  getAnalytics(): Analytics {
    return this.analyticsSubject.value;
  }

  refreshAnalytics(): void {
    const refreshed: Analytics = {
      productivityScore: Math.floor(Math.random() * 20) + 80,
      teamPerformance: Math.floor(Math.random() * 15) + 85,
      clientSatisfaction: Math.floor(Math.random() * 10) + 90,
      revenue: Math.floor(Math.random() * 50000) + 100000
    };
    this.analyticsSubject.next(refreshed);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    const data = {
      userStats: this.getUserStats(),
      analytics: this.getAnalytics()
    };
    localStorage.setItem('dashboardData', JSON.stringify(data));
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem('dashboardData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.userStats) this.userStatsSubject.next(data.userStats);
        if (data.analytics) this.analyticsSubject.next(data.analytics);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    }
  }
}