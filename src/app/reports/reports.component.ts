import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css', './stat-cards-mobile.css']
})
export class ReportsComponent implements OnInit {
  reportTypes = [
    { id: 'projects', name: 'Relatório de Projetos', icon: '📊', format: 'PDF' },
    { id: 'tasks', name: 'Relatório de Tarefas', icon: '✅', format: 'PDF' },
    { id: 'analytics', name: 'Relatório de Analytics', icon: '📈', format: 'PDF' },
    { id: 'complete', name: 'Relatório Completo', icon: '📋', format: 'PDF' }
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

  async downloadReport(report: any) {
    try {
      let blob: Blob;
      let extension = report.format.toLowerCase();
      
      if (report.format === 'PDF') {
        blob = await this.generatePDFContent(report);
      } else {
        const content = this.generateReportContent(report);
        blob = new Blob([content], { 
          type: report.format === 'CSV' ? 'text/csv' : 'text/html' 
        });
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.type}-${report.generatedAt.toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download do relatório:', error);
      alert('Erro ao gerar o relatório. Tente novamente.');
    }
  }

  private async generatePDFContent(report: any): Promise<Blob> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Cabeçalho
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(report.name || 'Relatório', margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, yPosition);
      yPosition += 20;

      // Linha separadora
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Conteúdo simples
      pdf.setFontSize(14);
      pdf.text('Relatório gerado com sucesso!', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.text(`Tipo: ${report.name}`, margin, yPosition);
      yPosition += 8;
      pdf.text(`Data de geração: ${report.generatedAt.toLocaleDateString('pt-BR')}`, margin, yPosition);
      yPosition += 8;
      pdf.text(`Formato: ${report.format}`, margin, yPosition);
      yPosition += 15;

      pdf.text('Este é um relatório básico do sistema Ars Machina.', margin, yPosition);
      yPosition += 8;
      pdf.text('Para relatórios mais detalhados, utilize o sistema avançado.', margin, yPosition);

      // Rodapé
      const footerY = pageHeight - 20;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Ars Machina Consultancy - Relatório Automatizado', margin, footerY);
      pdf.text(`Página 1`, pageWidth - margin - 20, footerY);

      return new Blob([pdf.output('blob')], { type: 'application/pdf' });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Falha na geração do PDF: ' + error);
    }
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