import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  activeSection = 'guides';
  searchTerm = '';

  guides = [
    {
      id: 'projects',
      title: 'Como criar e gerenciar projetos',
      icon: '📊',
      content: 'Aprenda a criar, editar e acompanhar o progresso dos seus projetos.',
      steps: [
        'Clique em "Novo Projeto" no dashboard',
        'Preencha as informações básicas',
        'Defina prazo e tamanho da equipe',
        'Acompanhe o progresso na tela principal'
      ]
    },
    {
      id: 'tasks',
      title: 'Gerenciamento de tarefas',
      icon: '✅',
      content: 'Organize suas tarefas de forma eficiente.',
      steps: [
        'Acesse "Nova Tarefa" no menu',
        'Associe a tarefa a um projeto',
        'Defina prioridade e prazo',
        'Marque como concluída quando finalizar'
      ]
    },
    {
      id: 'reports',
      title: 'Geração de relatórios',
      icon: '📈',
      content: 'Gere relatórios detalhados do seu trabalho.',
      steps: [
        'Vá para a seção "Relatórios"',
        'Escolha o tipo de relatório',
        'Clique em "Gerar Relatório"',
        'Faça o download do arquivo gerado'
      ]
    }
  ];

  faqs = [
    {
      id: 'backup',
      question: 'Como fazer backup dos meus dados?',
      answer: 'Seus dados são salvos automaticamente no navegador. Use a função "Exportar Dados" nas configurações para fazer backup completo.'
    },
    {
      id: 'sharing',
      question: 'Como compartilhar projetos com a equipe?',
      answer: 'Use a função "Gerar Relatório" para criar arquivos que podem ser compartilhados. Em breve teremos colaboração em tempo real.'
    },
    {
      id: 'notifications',
      question: 'Como configurar notificações?',
      answer: 'Acesse "Configurações" > "Notificações" para personalizar quais alertas você deseja receber por email.'
    },
    {
      id: 'performance',
      question: 'Como melhorar a performance do sistema?',
      answer: 'Limpe o cache regularmente em "Configurações" > "Sistema" > "Limpar Cache". Mantenha poucos projetos ativos simultaneamente.'
    }
  ];

  tutorials: any[] = [];

  constructor(private translationService: TranslationService) {}

  ngOnInit() {}

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  showGuide(guideId: string) {
    const guide = this.guides.find(g => g.id === guideId);
    if (guide) {
      const stepsText = guide.steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
      alert(`${guide.title}\n\n${guide.content}\n\nPassos:\n${stepsText}`);
    }
  }

  showFAQ(faqId: string) {
    const faq = this.faqs.find(f => f.id === faqId);
    if (faq) {
      alert(`${faq.question}\n\n${faq.answer}`);
    }
  }



  contactSupport() {
    const subject = 'Solicitação de Suporte - Dashboard';
    const body = `Olá,\n\nPreciso de ajuda com:\n\n[Descreva seu problema aqui]\n\nAtenciosamente`;
    const mailtoUrl = `mailto:contato@arsmachinaconsultancy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }

  get filteredContent() {
    if (!this.searchTerm) return this.getCurrentSectionContent();
    
    const term = this.searchTerm.toLowerCase();
    return this.getCurrentSectionContent().filter((item: any) => 
      item.title?.toLowerCase().includes(term) ||
      item.question?.toLowerCase().includes(term) ||
      item.content?.toLowerCase().includes(term) ||
      item.answer?.toLowerCase().includes(term)
    );
  }

  private getCurrentSectionContent() {
    switch (this.activeSection) {
      case 'guides': return this.guides;
      case 'faqs': return this.faqs;
      default: return [];
    }
  }

  getTranslation(key: string): string {
    return this.translationService.translate(key);
  }
  
  getItemIcon(item: any): string {
    return item.icon || '📄';
  }
  
  getItemTitle(item: any): string {
    return item.title || '';
  }
  
  getItemContent(item: any): string {
    return item.content || '';
  }
  
  getItemQuestion(item: any): string {
    return item.question || '';
  }
  
  getItemDescription(item: any): string {
    return item.description || '';
  }
  
  getItemDuration(item: any): string {
    return item.duration || '';
  }
}