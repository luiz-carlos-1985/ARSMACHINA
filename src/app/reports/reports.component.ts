import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportTypes = [
    { id: 'projects', name: 'Relatório de Projetos', icon: '📊', format: 'CSV' },
    { id: 'tasks', name: 'Relatório de Tarefas', icon: '✅', format: 'CSV' },
    { id: 'analytics', name: 'Relatório de Analytics', icon: '📈', format: 'HTML' },
    { id: 'complete', name: 'Relatório Completo', icon: '📋', format: 'HTML' }
  ];

  selectedReport = 'projects';
  isGenerating = false;
  generatedReports: any[] = [];

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.loadGeneratedReports();
  }

  generateReport() {
    this.isGenerating = true;
    
    setTimeout(() => {
      const report = {
        id: Date.now(),
        type: this.selectedReport,
        name: this.reportTypes.find(r => r.id === this.selectedReport)?.name,
        format: this.reportTypes.find(r => r.id === this.selectedReport)?.format,
        generatedAt: new Date(),
        size: Math.floor(Math.random() * 500) + 50 + ' KB'
      };
      
      this.generatedReports.unshift(report);
      this.saveGeneratedReports();
      this.isGenerating = false;
      
      this.downloadReport(report);
    }, 2000);
  }

  downloadReport(report: any) {
    const content = this.generateReportContent(report);
    const blob = new Blob([content], { 
      type: report.format === 'CSV' ? 'text/csv' : 'text/html' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.type}-${report.generatedAt.toISOString().split('T')[0]}.${report.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private generateReportContent(report: any): string {
    const date = new Date().toLocaleDateString('pt-BR');
    
    if (report.format === 'CSV') {
      return `Relatório,Data,Tipo\n"${report.name}","${date}","${report.type}"`;
    } else {
      return `
<!DOCTYPE html>
<html>
<head>
    <title>${report.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { background: #f5f5f5; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.name}</h1>
        <p>Gerado em: ${date}</p>
    </div>
    <div class="content">
        <p>Relatório gerado com sucesso!</p>
    </div>
</body>
</html>`;
    }
  }

  deleteReport(report: any) {
    if (confirm('Deseja excluir este relatório?')) {
      this.generatedReports = this.generatedReports.filter(r => r.id !== report.id);
      this.saveGeneratedReports();
    }
  }

  private loadGeneratedReports() {
    const saved = localStorage.getItem('generatedReports');
    if (saved) {
      this.generatedReports = JSON.parse(saved).map((r: any) => ({
        ...r,
        generatedAt: new Date(r.generatedAt)
      }));
    }
  }

  private saveGeneratedReports() {
    localStorage.setItem('generatedReports', JSON.stringify(this.generatedReports));
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
  
  getReportIcon(type: string): string {
    const reportType = this.reportTypes.find(t => t.id === type);
    return reportType?.icon || '📄';
  }
}