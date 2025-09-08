import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatbotAiService, ChatMessage, ConversationContext, QuickReply } from '../services/chatbot-ai.service';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  filteredMessages: ChatMessage[] = [];
  context: ConversationContext = {
    sessionId: '',
    conversationStage: 'greeting',
    leadScore: 0
  };
  userInput: string = '';
  isLoading: boolean = false;
  isMinimized: boolean = false;
  showInfoBalloon: boolean = false;
  
  // New features
  unreadCount: number = 0;
  isOnline: boolean = true;
  showSearch: boolean = false;
  showSettings: boolean = false;
  showFileUpload: boolean = false;
  showScrollButton: boolean = false;
  showFeedbackModal: boolean = false;
  isRecording: boolean = false;
  isTyping: boolean = false;
  
  searchQuery: string = '';
  highlightedMessageId: string = '';
  typingSpeed: string = 'normal';
  soundEnabled: boolean = true;
  theme: string = 'light';
  feedbackRating: number = 0;
  feedbackText: string = '';
  
  smartSuggestions: Array<{text: string, icon: string}> = [];
  currentGreeting: string = 'Olá! Precisa de ajuda?';
  currentTypingText: string = 'Digitando...';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private chatbotAiService: ChatbotAiService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.isMinimized = true;
    this.showInfoBalloon = true;
    this.initializeSubscriptions();
    setTimeout(() => this.showInfoBalloon = false, 5000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeSubscriptions(): void {
    const historySubscription = this.chatbotAiService.getConversationHistory().subscribe(
      messages => {
        this.messages = messages;
        this.filteredMessages = messages;
        this.scrollToBottom();
      }
    );

    const contextSubscription = this.chatbotAiService.getContext().subscribe(
      context => {
        this.context = context;
      }
    );

    this.subscriptions.push(historySubscription, contextSubscription);
  }

  toggleChat() {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      this.showInfoBalloon = false;
      this.unreadCount = 0;
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const message = this.userInput.trim();
    this.userInput = '';
    this.isLoading = true;

    // Add user message
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      message: message,
      timestamp: new Date(),
      type: 'text'
    };
    this.messages.push(userMsg);
    this.filteredMessages = [...this.messages];
    
    // Generate business response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        message: this.getBusinessResponse(message),
        timestamp: new Date(),
        type: 'text'
      };
      this.messages.push(botResponse);
      this.filteredMessages = [...this.messages];
      this.isLoading = false;
      this.scrollToBottom();
    }, 1500);
    
    try {
      await this.chatbotAiService.processMessage(message);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  onQuickReplyClick(quickReply: QuickReply) {
    if (this.isLoading) return;
    this.userInput = quickReply.text;
    this.sendMessage();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearConversation() {
    this.chatbotAiService.clearConversation();
  }

  exportConversation() {
    const conversationData = this.chatbotAiService.exportConversation();
    const blob = new Blob([conversationData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation_${this.context.sessionId}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  sendQuickMessage(message: string) {
    this.userInput = message;
    this.sendMessage();
  }

  getBusinessResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('serviços') || lowerMessage.includes('ars machina')) {
      return `🏗️ **Nossos Serviços Especializados:**\n\n` +
             `💻 **Desenvolvimento de Software**\n` +
             `• Aplicações web modernas (React, Angular, Vue)\n` +
             `• Sistemas mobile (iOS/Android)\n` +
             `• APIs e microserviços\n\n` +
             `☁️ **Consultoria em Nuvem**\n` +
             `• Migração para AWS, Azure, Google Cloud\n` +
             `• Arquitetura serverless\n` +
             `• DevOps e CI/CD\n\n` +
             `🔒 **Segurança da Informação**\n` +
             `• Auditoria de segurança\n` +
             `• Implementação LGPD\n` +
             `• Pentest e compliance\n\n` +
             `🤖 **Inteligência Artificial**\n` +
             `• Chatbots inteligentes\n` +
             `• Automação de processos\n` +
             `• Análise de dados\n\n` +
             `💼 **Consultoria Estratégica**\n` +
             `• Transformação digital\n` +
             `• Mentoria técnica\n` +
             `• Treinamento de equipes\n\n` +
             `**Qual área mais te interessa?**`;
    }
    
    if (lowerMessage.includes('ideia') || lowerMessage.includes('projeto')) {
      return `💡 **Que ótimo! Adoramos transformar ideias em realidade!**\n\n` +
             `Para desenvolver a melhor solução para você, me conte:\n\n` +
             `🎯 **Qual é sua ideia?**\n` +
             `• Que problema você quer resolver?\n` +
             `• Quem é seu público-alvo?\n\n` +
             `💰 **Investimento disponível:**\n` +
             `• Projetos a partir de R$ 3.000\n` +
             `• Orçamento personalizado\n\n` +
             `⏰ **Prazo desejado:**\n` +
             `• Projetos rápidos: 1-3 meses\n` +
             `• Projetos complexos: 3-12 meses\n\n` +
             `**Vamos agendar uma conversa gratuita de 30min para detalhar sua ideia?**`;
    }
    
    if (lowerMessage.includes('dúvidas') || lowerMessage.includes('duvidas')) {
      return `❓ **Estou aqui para esclarecer tudo!**\n\n` +
             `**Perguntas mais frequentes:**\n\n` +
             `🕒 **Quanto tempo leva um projeto?**\n` +
             `• Sites simples: 2-4 semanas\n` +
             `• E-commerce: 2-3 meses\n` +
             `• Apps mobile: 3-6 meses\n` +
             `• Sistemas complexos: 6-12 meses\n\n` +
             `💰 **Como funciona o investimento?**\n` +
             `• Avaliação gratuita inicial\n` +
             `• Orçamento fixo sem surpresas\n` +
             `• Pagamento parcelado\n` +
             `• 3 meses de suporte incluído\n\n` +
             `🛠️ **Que tecnologias usamos?**\n` +
             `• Sempre as mais modernas e seguras\n` +
             `• Escolhemos a melhor para seu projeto\n` +
             `• Código limpo e documentado\n\n` +
             `**Qual sua dúvida específica?**`;
    }
    
    if (lowerMessage.includes('falar') || lowerMessage.includes('consultor') || lowerMessage.includes('contato')) {
      return `📞 **Vamos conversar! Temos várias opções:**\n\n` +
             `🚀 **URGENTE? WhatsApp direto:**\n` +
             `• +55 98 99964-9215\n` +
             `• Resposta em até 1 hora\n` +
             `• Disponível 24h\n\n` +
             `📧 **Email profissional:**\n` +
             `• contato@arsmachinaconsultancy.com\n` +
             `• Resposta em até 4 horas úteis\n\n` +
             `📅 **Reunião gratuita de 30min:**\n` +
             `• Análise do seu projeto\n` +
             `• Proposta personalizada\n` +
             `• Sem compromisso\n\n` +
             `🏢 **Escritório em São Luís/MA:**\n` +
             `• Atendimento presencial\n` +
             `• Segunda a sexta: 9h às 18h\n\n` +
             `**Como prefere falar conosco?**`;
    }
    
    return `🤖 **Olá! Sou o assistente da Ars Machina Consultancy.**\n\n` +
           `Somos especialistas em **transformar ideias em soluções digitais** que geram resultados reais para seu negócio.\n\n` +
           `**Como posso ajudar você hoje?**\n\n` +
           `🏗️ Conhecer nossos serviços\n` +
           `💡 Discutir sua ideia de projeto\n` +
           `❓ Tirar dúvidas sobre tecnologia\n` +
           `📞 Falar com nossos especialistas\n\n` +
           `**Mais de 200 projetos entregues com sucesso!**`;
  }

  formatMessageText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  // New methods
  getRandomGreeting(): string {
    return this.currentGreeting;
  }

  getResponseTime(): string {
    return 'Resposta em ~2s';
  }

  getTypingText(): string {
    return this.currentTypingText;
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  searchMessages() {
    if (!this.searchQuery.trim()) {
      this.filteredMessages = this.messages;
      return;
    }
    this.filteredMessages = this.messages.filter(msg => 
      msg.message.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredMessages = this.messages;
    this.showSearch = false;
  }

  changeTheme() {
    document.body.className = this.theme === 'dark' ? 'dark-theme' : '';
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  copyMessage(message: ChatMessage) {
    navigator.clipboard.writeText(message.message);
  }

  rateMessage(message: ChatMessage, rating: 'positive' | 'negative') {
    (message as any).rating = rating;
  }

  toggleFileUpload() {
    this.showFileUpload = !this.showFileUpload;
  }

  toggleVoiceInput() {
    this.isRecording = !this.isRecording;
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      this.userInput = `📎 Arquivo anexado: ${file.name}`;
      this.showFileUpload = false;
    }
  }

  onInputChange() {
    this.isTyping = this.userInput.length > 0;
  }

  clearSuggestions() {
    this.smartSuggestions = [];
  }

  setRating(rating: number) {
    this.feedbackRating = rating;
  }

  submitFeedback() {
    this.showFeedbackModal = false;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
  }
}