import { Component, OnInit, ElementRef, ViewChild, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval, fromEvent } from 'rxjs';
import { ChatbotAiService, ChatMessage, ConversationContext, QuickReply } from '../services/chatbot-ai.service';
import { TranslationService } from '../translation.service';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateY(0%)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0, scale: 0.95 }),
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'translateY(0)', opacity: 1, scale: 1 }))
      ])
    ]),
    trigger('pulseAnimation', [
      state('pulse', style({ transform: 'scale(1.05)' })),
      transition('* => pulse', animate('200ms ease-in-out')),
      transition('pulse => *', animate('200ms ease-in-out'))
    ]),
    trigger('staggerMessages', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;


  // Core chat properties
  messages: ChatMessage[] = [];
  filteredMessages: ChatMessage[] = [];
  context: ConversationContext = {
    sessionId: '',
    conversationStage: 'greeting',
    leadScore: 0
  };
  userInput: string = '';
  isLoading: boolean = false;
  isMinimized: boolean = true;
  showInfoBalloon: boolean = true;
  
  // Advanced AI features
  aiPersonality: 'professional' | 'friendly' | 'technical' = 'friendly';
  conversationMode: 'sales' | 'support' | 'consultation' = 'sales';
  intelligenceLevel: number = 95;
  responseAccuracy: number = 98;
  learningEnabled: boolean = true;
  contextAwareness: boolean = true;
  
  // Modern UI features
  unreadCount: number = 0;
  isOnline: boolean = true;
  connectionQuality: 'excellent' | 'good' | 'poor' = 'excellent';
  showSearch: boolean = false;
  showSettings: boolean = false;
  showAnalytics: boolean = false;
  showFileUpload: boolean = false;
  showScrollButton: boolean = false;
  showFeedbackModal: boolean = false;
  showEmojiPicker: boolean = false;
  showQuickActions: boolean = false;
  

  
  // Advanced interaction
  isTyping: boolean = false;
  showWhatsAppButton: boolean = false;
  selectedService: string = '';
  userSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  conversationFlow: string[] = [];
  suggestedResponses: string[] = [];
  
  // Search & Navigation
  searchQuery: string = '';
  highlightedMessageId: string = '';
  searchResults: ChatMessage[] = [];
  currentSearchIndex: number = 0;
  
  // Customization
  typingSpeed: string = 'normal';
  soundEnabled: boolean = true;
  theme: 'light' | 'dark' | 'auto' | 'neon' | 'minimal' = 'neon';
  chatStyle: 'modern' | 'classic' | 'futuristic' = 'futuristic';
  animationsEnabled: boolean = true;
  compactMode: boolean = false;
  
  // Feedback & Analytics
  feedbackRating: number = 0;
  feedbackText: string = '';
  conversationRating: number = 0;
  userSatisfaction: number = 0;
  responseTime: number = 0;
  
  // Dragging & Positioning
  isDragging: boolean = false;
  dragOffset = { x: 0, y: 0 };
  position = { x: 24, y: 24 };
  hasDragged: boolean = false;
  dragStartPos = { x: 0, y: 0 };
  isFloating: boolean = true;
  
  // Smart features
  autoComplete: string[] = [];
  smartSuggestions: string[] = [];
  predictiveText: boolean = true;
  contextualHelp: boolean = true;
  proactiveAssistance: boolean = true;
  currentMessage: string = '';
  quickReplies: string[] = [];
  showQuickReplies: boolean = false;
  userName: string = '';
  userPreferences: any = {};
  conversationHistory: string[] = [];
  lastUserActivity: Date = new Date();
  userLanguage: 'pt' | 'en' = 'pt';
  
  // Real-time features
  currentGreeting: string = '';
  currentTypingText: string = '';
  lastActivity: Date = new Date();
  sessionDuration: number = 0;
  messageCount: number = 0;
  
  // Performance monitoring
  responseLatency: number = 0;
  systemLoad: number = 0;
  memoryUsage: number = 0;
  
  // Advanced states
  pulseState: string = '';
  glowIntensity: number = 0;
  particleEffect: boolean = false;
  hologramMode: boolean = false;
  
  private subscriptions: Subscription[] = [];


  constructor(
    private chatbotAiService: ChatbotAiService,
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeAdvancedFeatures();
  }

  ngOnInit() {
    this.isMinimized = true;
    this.showInfoBalloon = true;
    this.setInitialPosition();
    this.initializeSubscriptions();
    this.addOrientationListener();
    this.startPerformanceMonitoring();
    this.initializeParticleSystem();
    this.setupAdvancedAnimations();
    this.startSessionTimer();
    this.getUserLanguagePreference();
    setTimeout(() => this.showInfoBalloon = false, 8000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());

    this.stopPerformanceMonitoring();
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
      this.scrollToBottom();
    }
  }

  openChat() {
    this.isMinimized = false;
    this.showInfoBalloon = false;
    this.unreadCount = 0;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom() {
    if (this.chatContainer?.nativeElement) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const startTime = performance.now();
    const message = this.userInput.trim();
    this.userInput = '';
    this.isLoading = true;
    this.messageCount++;

    // Advanced message processing
    this.analyzeUserSentiment(message);
    this.updateConversationFlow(message);
    this.checkForServiceMention(message);
    this.generateSmartSuggestions(message);
    this.detectUserName(message);
    this.detectAndSetLanguage(message);
    this.updateUserActivity();
    this.generateQuickReplies(message);

    // Add user message with enhanced metadata
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      message: message,
      timestamp: new Date(),
      type: 'text',
      metadata: {
        sentiment: this.userSentiment,
        wordCount: message.split(' ').length,
        hasEmoji: /\p{Emoji}/u.test(message),
        language: this.detectLanguage(message)
      }
    };
    
    this.messages.push(userMsg);
    this.filteredMessages = [...this.messages];
    this.scrollToBottom();
    this.triggerPulseAnimation();
    
    // Advanced AI response generation
    try {
      const response = await this.generateAdvancedResponse(message);
      const endTime = performance.now();
      this.responseLatency = endTime - startTime;
      
      const botResponse: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        message: response.message,
        timestamp: new Date(),
        type: response.type || 'text',
        metadata: {
          ...response.metadata,
          responseTime: this.responseLatency,
          confidence: response.confidence || 95,
          aiPersonality: this.aiPersonality
        }
      };
      
      // Simulate realistic typing delay based on message length
      const typingDelay = Math.min(Math.max(response.message.length * 30, 800), 3000);
      
      setTimeout(() => {
        this.messages.push(botResponse);
        this.filteredMessages = [...this.messages];
        this.isLoading = false;
        this.currentTypingText = '';
        this.scrollToBottom();
        this.playNotificationSound();
        this.showQuickReplies = true;
        this.cdr.detectChanges();
      }, typingDelay);
      
    } catch (error) {
      console.error('Error generating response:', error);
      this.handleResponseError();
    }
  }

  // Advanced AI response generation
  private async generateAdvancedResponse(message: string): Promise<any> {
    const context = await this.analyzeMessageContext(message);
    const intent = this.detectAdvancedIntent(message, context);
    const personality = this.getPersonalityResponse(intent);
    
    return {
      message: this.getContextualResponse(message),
      type: 'text',
      confidence: this.calculateResponseConfidence(message, intent),
      metadata: {
        intent: intent,
        context: context,
        personality: personality,
        suggestions: this.generateContextualSuggestions(intent)
      }
    };
  }

  private async analyzeMessageContext(message: string): Promise<any> {
    return {
      previousMessages: this.messages.slice(-5),
      userProfile: this.buildUserProfile(),
      sessionData: this.getSessionAnalytics(),
      timeContext: this.getTimeContext()
    };
  }

  private detectAdvancedIntent(message: string, context: any): string {
    const lowerMessage = message.toLowerCase();
    
    // Advanced intent detection with ML-like scoring
    const intents: {[key: string]: number} = {
      greeting: this.scoreIntent(lowerMessage, ['oi', 'olá', 'hello', 'bom dia', 'boa tarde']),
      pricing: this.scoreIntent(lowerMessage, ['preço', 'custo', 'valor', 'orçamento', 'quanto']),
      services: this.scoreIntent(lowerMessage, ['serviços', 'desenvolvimento', 'app', 'site']),
      contact: this.scoreIntent(lowerMessage, ['contato', 'telefone', 'whatsapp', 'email']),
      technical: this.scoreIntent(lowerMessage, ['como funciona', 'tecnologia', 'processo']),
      urgent: this.scoreIntent(lowerMessage, ['urgente', 'rápido', 'hoje', 'agora'])
    };
    
    return Object.entries(intents).reduce((a, b) => intents[a[0]] > intents[b[0]] ? a : b)[0];
  }

  private scoreIntent(message: string, keywords: string[]): number {
    let score = 0;
    keywords.forEach(keyword => {
      if (message.includes(keyword)) {
        score += keyword.length / message.length * 100;
      }
    });
    return Math.min(score, 100);
  }

  private getPersonalityResponse(intent: string): any {
    const personalities = {
      professional: {
        greeting: 'Bom dia. Como posso auxiliá-lo hoje?',
        tone: 'formal',
        emoji: false
      },
      friendly: {
        greeting: '👋 Oi! Como posso te ajudar hoje?',
        tone: 'casual',
        emoji: true
      },
      technical: {
        greeting: 'Olá! Pronto para discutir soluções técnicas?',
        tone: 'technical',
        emoji: false
      }
    };
    
    return personalities[this.aiPersonality] || personalities.friendly;
  }

  private analyzeUserSentiment(message: string): void {
    const positiveWords = ['ótimo', 'excelente', 'perfeito', 'adorei', 'incrível'];
    const negativeWords = ['ruim', 'péssimo', 'problema', 'erro', 'difícil'];
    
    const lowerMessage = message.toLowerCase();
    let sentiment = 'neutral';
    
    if (positiveWords.some(word => lowerMessage.includes(word))) {
      sentiment = 'positive';
    } else if (negativeWords.some(word => lowerMessage.includes(word))) {
      sentiment = 'negative';
    }
    
    this.userSentiment = sentiment as any;
  }

  private updateConversationFlow(message: string): void {
    this.conversationFlow.push(message);
    if (this.conversationFlow.length > 10) {
      this.conversationFlow = this.conversationFlow.slice(-10);
    }
  }

  private generateSmartSuggestions(message: string): void {
    const lowerMessage = message.toLowerCase();
    let suggestions = [];
    
    if (this.userLanguage === 'en') {
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        suggestions = [
          'View available packages',
          'Request custom quote',
          'Schedule free consultation'
        ];
      } else if (lowerMessage.includes('service') || lowerMessage.includes('development')) {
        suggestions = [
          'Web development',
          'Mobile apps',
          'Cloud infrastructure'
        ];
      } else {
        suggestions = [
          'Would you like to know more about our services?',
          'Can I help with a personalized quote?',
          'Do you have a specific project in mind?'
        ];
      }
    } else {
      if (lowerMessage.includes('preço') || lowerMessage.includes('custo')) {
        suggestions = [
          'Ver pacotes disponíveis',
          'Solicitar orçamento personalizado',
          'Agendar consulta gratuita'
        ];
      } else if (lowerMessage.includes('serviço') || lowerMessage.includes('desenvolvimento')) {
        suggestions = [
          'Sites e sistemas web',
          'Aplicativos mobile',
          'Cloud e infraestrutura'
        ];
      } else {
        suggestions = [
          'Gostaria de saber mais sobre nossos serviços?',
          'Posso ajudar com um orçamento personalizado?',
          'Tem algum projeto específico em mente?'
        ];
      }
    }
    
    this.suggestedResponses = suggestions;
  }

  private detectLanguage(message: string): string {
    const englishWords = ['hello', 'how', 'what', 'when', 'where', 'service', 'price'];
    const portugueseWords = ['olá', 'como', 'que', 'quando', 'onde', 'serviço', 'preço'];
    
    const lowerMessage = message.toLowerCase();
    const englishCount = englishWords.filter(word => lowerMessage.includes(word)).length;
    const portugueseCount = portugueseWords.filter(word => lowerMessage.includes(word)).length;
    
    return englishCount > portugueseCount ? 'en' : 'pt';
  }

  private calculateResponseConfidence(message: string, intent: string): number {
    let confidence = 85;
    
    // Boost confidence based on clear intent
    if (intent !== 'default') confidence += 10;
    
    // Boost confidence for longer, more detailed messages
    if (message.length > 50) confidence += 5;
    
    return Math.min(confidence, 99);
  }

  private generateContextualSuggestions(intent: string): string[] {
    const suggestions: {[key: string]: string[]} = {
      greeting: ['Ver serviços', 'Solicitar orçamento', 'Falar com especialista'],
      pricing: ['Agendar consulta', 'Ver portfólio', 'Comparar pacotes'],
      services: ['Desenvolvimento web', 'Apps mobile', 'Cloud computing'],
      contact: ['WhatsApp', 'Email', 'Telefone']
    };
    
    return suggestions[intent] || suggestions['greeting'];
  }

  private buildUserProfile(): any {
    return {
      messageCount: this.messageCount,
      sessionDuration: this.sessionDuration,
      preferredLanguage: 'pt-BR',
      sentiment: this.userSentiment,
      interests: this.conversationFlow
    };
  }

  private getSessionAnalytics(): any {
    return {
      duration: this.sessionDuration,
      messages: this.messageCount,
      avgResponseTime: this.responseLatency,
      satisfaction: this.userSatisfaction
    };
  }

  private getTimeContext(): any {
    const now = new Date();
    return {
      hour: now.getHours(),
      dayOfWeek: now.getDay(),
      isBusinessHours: now.getHours() >= 9 && now.getHours() <= 18
    };
  }

  private handleResponseError(): void {
    this.isLoading = false;
    const errorMsg: ChatMessage = {
      id: 'error_' + Date.now(),
      sender: 'bot',
      message: '🔧 Ops! Tive um pequeno problema técnico. Mas já estou funcionando perfeitamente novamente! Como posso ajudar?',
      timestamp: new Date(),
      type: 'text'
    };
    
    this.messages.push(errorMsg);
    this.filteredMessages = [...this.messages];
    this.scrollToBottom();
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
    const csvData = this.generateCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversa_ars_machina_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(): string {
    const headers = ['Data/Hora', 'Remetente', 'Mensagem'];
    const csvRows = [headers.join(',')];
    
    this.messages.forEach(message => {
      const timestamp = new Date(message.timestamp).toLocaleString('pt-BR');
      const sender = message.sender === 'user' ? 'Usuário' : 'Ars Machina AI';
      const content = message.message.replace(/["\n\r]/g, ' ').replace(/,/g, ';');
      csvRows.push(`"${timestamp}","${sender}","${content}"`);
    });
    
    return csvRows.join('\n');
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  getBusinessResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    const isEnglish = this.userLanguage === 'en';
    const greeting = this.userName ? `${this.userName}, ` : '';
    
    // Mensagem inicial atrativa mostrando serviços - apenas para saudações
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('hello') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
      return `🎯 **${greeting}Excelente! Você está falando com o especialista certo.**\n\n` +
             `Sou consultor sênior da **Ars Machina Consultancy** - referência em transformação digital corporativa.\n\n` +
             `📊 **NOSSOS RESULTADOS COMPROVADOS:**\n` +
             `✅ **+20 empresas** transformadas digitalmente\n` +
             `✅ **ROI médio de 300%** em 12 meses\n` +
             `✅ **98% de satisfação** dos clientes\n` +
             `✅ Equipe **certificada** pelas principais clouds\n\n` +
             `🏆 **ESPECIALIDADES ENTERPRISE:**\n\n` +
             `💼 **Desenvolvimento Corporativo**\n` +
             `• Sistemas ERP/CRM sob medida\n` +
             `• Plataformas web de alta performance\n` +
             `• Apps mobile enterprise\n\n` +
             `☁️ **Cloud & DevOps**\n` +
             `• Migração segura para nuvem\n` +
             `• Redução de custos até 60%\n` +
             `• Infraestrutura auto-escalável\n\n` +
             `🛡️ **Cibersegurança & Compliance**\n` +
             `• Auditoria ISO 27001\n` +
             `• Implementação LGPD\n` +
             `• SOC 24/7 terceirizado\n\n` +
             `🤖 **IA & Automação**\n` +
             `• IA generativa para negócios\n` +
             `• RPA (automação de processos)\n` +
             `• Analytics preditivos\n\n` +
             `💎 **OFERTA EXCLUSIVA:** Consultoria estratégica **GRATUITA** de 60 minutos\n\n` +
             `**Qual desafio tecnológico da sua empresa posso ajudar a resolver?**`;
    }
    
    if (lowerMessage.includes('serviços') || lowerMessage.includes('servicos') || lowerMessage.includes('desenvolvimento') || lowerMessage.includes('services') || lowerMessage.includes('development')) {
      this.showWhatsAppButton = true;
      this.selectedService = 'Desenvolvimento';
      return `🏗️ **PORTFÓLIO COMPLETO ARS MACHINA:**\n\n` +
             `🌟 **DESENVOLVIMENTO WEB & MOBILE**\n` +
             `• Sites institucionais responsivos\n` +
             `• Sistemas web complexos (React, Angular, Vue)\n` +
             `• E-commerce Shopify/WooCommerce\n` +
             `• Apps mobile nativas e híbridas\n` +
             `• PWAs (Progressive Web Apps)\n` +
             `💰 **A partir de R$ 8.500**\n\n` +
             `☁️ **CLOUD & INFRAESTRUTURA**\n` +
             `• Migração completa para nuvem\n` +
             `• AWS, Azure, Google Cloud\n` +
             `• DevOps e CI/CD\n` +
             `• Monitoramento 24/7\n` +
             `• Backup automático\n` +
             `💰 **A partir de R$ 4.500**\n\n` +
             `🔐 **CIBERSEGURANÇA EMPRESARIAL**\n` +
             `• Auditoria completa de segurança\n` +
             `• Implementação LGPD\n` +
             `• Pentest e análise de vulnerabilidades\n` +
             `• Treinamento de equipes\n` +
             `💰 **A partir de R$ 12.000**\n\n` +
             `🤖 **INTELIGÊNCIA ARTIFICIAL**\n` +
             `• Chatbots personalizados\n` +
             `• Automação de processos\n` +
             `• Análise de dados com ML\n` +
             `• Visão computacional\n` +
             `💰 **A partir de R$ 15.000**\n\n` +
             `**🎁 BÔNUS: Consultoria gratuita de 1h para novos clientes!**\n\n` +
             `**Qual serviço desperta seu interesse?**`;
    }
    
    if (lowerMessage.includes('preço') || lowerMessage.includes('preco') || lowerMessage.includes('custo') || lowerMessage.includes('valor') || lowerMessage.includes('orçamento') || lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing') || lowerMessage.includes('budget') || lowerMessage.includes('quote')) {
      if (isEnglish) {
        return `💰 **SMART INVESTMENT IN TECHNOLOGY:**\n\n` +
               `🎯 **PREMIUM PACKAGES:**\n\n` +
               `📱 **PROFESSIONAL WEBSITE**\n` +
               `• Modern responsive design\n` +
               `• SEO optimized\n` +
               `• 1-year hosting included\n` +
               `• **$15,000** (12 installments available)\n\n` +
               `🛍️ **COMPLETE E-COMMERCE**\n` +
               `• Professional online store\n` +
               `• Payment gateway integration\n` +
               `• Inventory management\n` +
               `• **$35,000** (up to 18 installments)\n\n` +
               `📱 **MOBILE APP**\n` +
               `• iOS + Android\n` +
               `• Native design\n` +
               `• App store publication\n` +
               `• **$50,000** (up to 24 installments)\n\n` +
               `☁️ **CLOUD MIGRATION**\n` +
               `• Complete AWS/Azure setup\n` +
               `• Data migration\n` +
               `• 24/7 monitoring\n` +
               `• **$8,000/month**\n\n` +
               `🎁 **SPECIAL OFFER:**\n` +
               `• **25% OFF** for new international clients\n` +
               `• Free consultation\n` +
               `• 3 months support included\n\n` +
               `**Type 'contact' to request a personalized quote!**`;
      }
      return `💰 **INVESTIMENTO INTELIGENTE EM TECNOLOGIA:**\n\n` +
             `🎯 **PACOTES PROMOCIONAIS:**\n\n` +
             `📱 **SITE PROFISSIONAL**\n` +
             `• Design moderno e responsivo\n` +
             `• SEO otimizado\n` +
             `• Hospedagem inclusa (1 ano)\n` +
             `• **R$ 8.500** (12x sem juros)\n\n` +
             `🛒 **E-COMMERCE COMPLETO**\n` +
             `• Loja virtual profissional\n` +
             `• Integração com pagamentos\n` +
             `• Gestão de estoque\n` +
             `• **R$ 15.000** (até 18x)\n\n` +
             `📱 **APP MOBILE**\n` +
             `• iOS + Android\n` +
             `• Design nativo\n` +
             `• Publicação nas lojas\n` +
             `• **R$ 25.000** (até 24x)\n\n` +
             `☁️ **MIGRAÇÃO CLOUD**\n` +
             `• Setup completo AWS/Azure\n` +
             `• Migração de dados\n` +
             `• Monitoramento 24/7\n` +
             `• **R$ 4.500**\n\n` +
             `🎁 **OFERTA ESPECIAL:**\n` +
             `• **20% OFF** para novos clientes\n` +
             `• Consultoria gratuita\n` +
             `• 3 meses de suporte incluso\n\n` +
             `**Digite 'contato' para solicitar orçamento personalizado!**`;
    }
    
    if (lowerMessage.includes('contato') || lowerMessage.includes('falar') || lowerMessage.includes('consultor') || lowerMessage.includes('whatsapp') || lowerMessage.includes('contact') || lowerMessage.includes('talk') || lowerMessage.includes('speak') || lowerMessage.includes('consultant')) {
      if (isEnglish) {
        return `📞 **CONTACT US NOW - VIP SERVICE:**\n\n` +
               `🚀 **DIRECT CONTACT (FAST RESPONSE):**\n` +
               `📱 **WhatsApp:** +55 98 99964-9215\n` +
               `⚡ Response within 30 minutes\n` +
               `🕐 Available: Mon-Fri 8am-8pm | Sat 9am-3pm (GMT-3)\n\n` +
               `📧 **Business Email:**\n` +
               `✉️ contact@arsmachinaconsultancy.com\n` +
               `⏰ Response within 2 business hours\n\n` +
               `🎯 **SCHEDULE YOUR FREE CONSULTATION:**\n` +
               `• Complete project analysis\n` +
               `• Detailed technical proposal\n` +
               `• No-obligation quote\n` +
               `• Development roadmap\n\n` +
               `🏢 **Office São Luís/Brazil:**\n` +
               `📍 In-person meetings available\n` +
               `🕒 Monday to Friday: 9am to 6pm\n\n` +
               `💡 **TIP:** Mention you came from chat and get 20% discount!\n\n` +
               `**Do you prefer WhatsApp or email?**`;
      }
      return `📞 **FALE CONOSCO AGORA - ATENDIMENTO VIP:**\n\n` +
             `🚀 **CONTATO DIRETO (RESPOSTA RÁPIDA):**\n` +
             `📱 **WhatsApp:** +55 98 99964-9215\n` +
             `⚡ Resposta em até 30 minutos\n` +
             `🕐 Disponível: Seg-Sex 8h-20h | Sáb 9h-15h\n\n` +
             `📧 **Email Comercial:**\n` +
             `✉️ contato@arsmachinaconsultancy.com\n` +
             `⏰ Resposta em até 2 horas úteis\n\n` +
             `🎯 **AGENDE SUA CONSULTORIA GRATUITA:**\n` +
             `• Análise completa do seu projeto\n` +
             `• Proposta técnica detalhada\n` +
             `• Orçamento sem compromisso\n` +
             `• Roadmap de desenvolvimento\n\n` +
             `🏢 **Escritório São Luís/MA:**\n` +
             `📍 Atendimento presencial disponível\n` +
             `🕒 Segunda a sexta: 9h às 18h\n\n` +
             `💡 **DICA:** Mencione que veio do chat e ganhe 15% de desconto!\n\n` +
             `**Prefere WhatsApp ou email?**`;
    }
    
    if (lowerMessage.includes('ideia') || lowerMessage.includes('projeto') || lowerMessage.includes('startup') || lowerMessage.includes('idea') || lowerMessage.includes('project')) {
      if (isEnglish) {
        return `💡 **WE TRANSFORM YOUR IDEA INTO DIGITAL REALITY!**\n\n` +
               `🎯 **ARS MACHINA PROCESS:**\n\n` +
               `1️⃣ **DISCOVERY (FREE)**\n` +
               `• Understand your vision\n` +
               `• Feasibility analysis\n` +
               `• Scope definition\n\n` +
               `2️⃣ **PLANNING**\n` +
               `• Solution architecture\n` +
               `• Detailed timeline\n` +
               `• Transparent budget\n\n` +
               `3️⃣ **DEVELOPMENT**\n` +
               `• Agile methodology\n` +
               `• Weekly deliveries\n` +
               `• Rigorous testing\n\n` +
               `4️⃣ **LAUNCH & SUPPORT**\n` +
               `• Professional deployment\n` +
               `• Team training\n` +
               `• Continuous support\n\n` +
               `🚀 **SUCCESS CASES:**\n` +
               `• E-commerce that earned $2M in the 1st year\n` +
               `• App with +50k downloads\n` +
               `• System that reduced costs by 60%\n\n` +
               `**Tell me your idea! What problem do you want to solve?**`;
      }
      return `💡 **TRANSFORMAMOS SUA IDEIA EM REALIDADE DIGITAL!**\n\n` +
             `🎯 **PROCESSO ARS MACHINA:**\n\n` +
             `1️⃣ **DESCOBERTA (GRATUITA)**\n` +
             `• Entendemos sua visão\n` +
             `• Análise de viabilidade\n` +
             `• Definição de escopo\n\n` +
             `2️⃣ **PLANEJAMENTO**\n` +
             `• Arquitetura da solução\n` +
             `• Cronograma detalhado\n` +
             `• Orçamento transparente\n\n` +
             `3️⃣ **DESENVOLVIMENTO**\n` +
             `• Metodologia ágil\n` +
             `• Entregas semanais\n` +
             `• Testes rigorosos\n\n` +
             `4️⃣ **LANÇAMENTO & SUPORTE**\n` +
             `• Deploy profissional\n` +
             `• Treinamento da equipe\n` +
             `• Suporte contínuo\n\n` +
             `🚀 **CASES DE SUCESSO:**\n` +
             `• E-commerce que faturou R$ 2M no 1º ano\n` +
             `• App com +50k downloads\n` +
             `• Sistema que reduziu custos em 60%\n\n` +
             `**Me conte sua ideia! Qual problema você quer resolver?**`;
    }
    
    // Resposta padrão atrativa
    if (isEnglish) {
      return `🤖 **Hello${this.userName ? ' ' + this.userName : ''}! I'm your digital consultant from Ars Machina!**\n\n` +
             `We're here to **revolutionize your business** with cutting-edge technology!\n\n` +
             `💻 Type **'services'** - See our complete portfolio\n` +
             `💰 Type **'pricing'** - Learn about our packages\n` +
             `💡 Type **'idea'** - Transform your idea into a project\n` +
             `📞 Type **'contact'** - Speak with a specialist\n\n` +
             `🏆 **WHY CHOOSE ARS MACHINA?**\n` +
             `✅ +20 successfully delivered projects\n` +
             `✅ Specialized and certified team\n` +
             `✅ Proven agile methodology\n` +
             `✅ 24/7 technical support\n` +
             `✅ Quality guarantee\n\n` +
             `**Ready to start your digital transformation now?**`;
    }
    return `🤖 **${greeting}Olá! Sou seu consultor digital da Ars Machina!**\n\n` +
           `Estamos aqui para **revolucionar seu negócio** com tecnologia de ponta!\n\n` +
           `💻 Digite **'serviços'** - Ver nosso portfólio completo\n` +
           `💰 Digite **'preços'** - Conhecer nossos pacotes\n` +
           `💡 Digite **'ideia'** - Transformar sua ideia em projeto\n` +
           `📞 Digite **'contato'** - Falar com especialista\n\n` +
           `🏆 **POR QUE ESCOLHER A ARS MACHINA?**\n` +
           `✅ +20 projetos entregues com sucesso\n` +
           `✅ Equipe especializada e certificada\n` +
           `✅ Metodologia ágil comprovada\n` +
           `✅ Suporte técnico 24/7\n` +
           `✅ Garantia de qualidade\n\n` +
           `**Vamos começar sua transformação digital agora?**`;
  }

  formatMessageText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  // New methods
  getRandomGreeting(): string {
    if (!this.currentGreeting) {
      const greetings = this.userLanguage === 'en' ? [
        '🚀 Hello! I\'m your advanced AI consultant!',
        '🤖 Hi! Ready to revolutionize your business?',
        '💡 Welcome to the future of digital consulting!',
        '🎯 Hello! Let\'s create something extraordinary together?',
        '⚡ Hi! Your digital transformation starts here!'
      ] : [
        '🚀 Olá! Sou sua IA consultora avançada!',
        '🤖 Oi! Pronto para revolucionar seu negócio?',
        '💡 Bem-vindo ao futuro da consultoria digital!',
        '🎯 Olá! Vamos criar algo extraordinário juntos?',
        '⚡ Oi! Sua transformação digital começa aqui!'
      ];
      this.currentGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    }
    return this.currentGreeting;
  }

  getResponseTime(): string {
    return this.userLanguage === 'en' ? 'Response in ~2s' : 'Resposta em ~2s';
  }

  getTypingText(): string {
    if (!this.currentTypingText) {
      const typingTexts = this.userLanguage === 'en' ? [
        '🧠 AI processing with 95% accuracy...',
        '🔮 Analyzing advanced neural context...',
        '⚡ Generating hyper-personalized response...',
        '🎯 Optimizing solution with advanced ML...',
        '🚀 Quantum processing in progress...',
        '💎 Refining response with deep learning...',
        '🌟 Synchronizing knowledge matrix...'
      ] : [
        '🧠 IA processando com 95% de precisão...',
        '🔮 Analisando contexto neural avançado...',
        '⚡ Gerando resposta hiper-personalizada...',
        '🎯 Otimizando solução com ML avançado...',
        '🚀 Processamento quântico em andamento...',
        '💎 Refinando resposta com deep learning...',
        '🌟 Sincronizando matriz de conhecimento...'
      ];
      this.currentTypingText = typingTexts[Math.floor(Math.random() * typingTexts.length)];
    }
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

  setRating(rating: number) {
    this.feedbackRating = rating;
  }

  submitFeedback() {
    this.showFeedbackModal = false;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
  }

  detectEnglish(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    // Palavras claramente em inglês
    const strongEnglishIndicators = ['hello', 'hi', 'good morning', 'good afternoon', 'good evening', 'services', 'development', 'website', 'price', 'cost', 'pricing', 'budget', 'quote', 'contact', 'help', 'can you', 'what', 'how', 'when', 'where', 'why', 'i need', 'i want', 'i would like', 'thank you', 'thanks'];
    
    // Palavras comuns em inglês
    const englishWords = ['the', 'and', 'or', 'but', 'with', 'for', 'from', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'my', 'your', 'his', 'her', 'our', 'their', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    // Verifica indicadores fortes
    if (strongEnglishIndicators.some(indicator => lowerMessage.includes(indicator))) {
      return true;
    }
    
    // Conta palavras em inglês
    const words = lowerMessage.split(/\s+/);
    const englishWordCount = words.filter(word => englishWords.includes(word)).length;
    
    // Se mais de 30% das palavras são em inglês, considera inglês
    return englishWordCount > 0 && (englishWordCount / words.length) >= 0.3;
  }

  openWhatsApp() {
    const phoneNumber = '5598999649215';
    const message = `Olá! Tenho interesse no serviço de ${this.selectedService}. Gostaria de mais informações.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  checkForServiceMention(message: string) {
    const lowerMessage = message.toLowerCase();
    
    // Detecta menção de serviços específicos
    if (lowerMessage.includes('desenvolvimento') || lowerMessage.includes('site') || lowerMessage.includes('app')) {
      this.selectedService = 'Desenvolvimento Web/Mobile';
      this.showWhatsAppButton = true;
    } else if (lowerMessage.includes('cloud') || lowerMessage.includes('aws') || lowerMessage.includes('azure')) {
      this.selectedService = 'Cloud Computing';
      this.showWhatsAppButton = true;
    } else if (lowerMessage.includes('segurança') || lowerMessage.includes('cibersegurança') || lowerMessage.includes('lgpd')) {
      this.selectedService = 'Cibersegurança';
      this.showWhatsAppButton = true;
    } else if (lowerMessage.includes('inteligência artificial') || lowerMessage.includes('ia') || lowerMessage.includes('automação')) {
      this.selectedService = 'Inteligência Artificial';
      this.showWhatsAppButton = true;
    }
  }

  // Drag functionality
  private boundDragMove = this.onDragMove.bind(this);
  private boundDragEnd = this.onDragEnd.bind(this);

  onDragStart(event: MouseEvent | TouchEvent) {
    if (this.isMinimized) {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      
      this.dragStartPos.x = clientX;
      this.dragStartPos.y = clientY;
      this.dragOffset.x = clientX - this.position.x;
      this.dragOffset.y = clientY - this.position.y;
      this.hasDragged = false;
      this.isDragging = false;
      
      document.addEventListener('mousemove', this.boundDragMove);
      document.addEventListener('mouseup', this.boundDragEnd);
      document.addEventListener('touchmove', this.boundDragMove);
      document.addEventListener('touchend', this.boundDragEnd);
      
      event.preventDefault();
    }
  }

  onDragMove(event: MouseEvent | TouchEvent) {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    // Check if moved more than 10px to consider as drag
    const deltaX = Math.abs(clientX - this.dragStartPos.x);
    const deltaY = Math.abs(clientY - this.dragStartPos.y);
    
    if (deltaX > 10 || deltaY > 10) {
      this.isDragging = true;
      this.hasDragged = true;
      
      const newX = clientX - this.dragOffset.x;
      const newY = clientY - this.dragOffset.y;
      
      // Constrain to viewport, avoiding navbar area (top 80px)
      const maxX = window.innerWidth - 72;
      const maxY = window.innerHeight - 72;
      const minY = 80; // Navbar height + margin
      
      this.position.x = Math.max(0, Math.min(newX, maxX));
      this.position.y = Math.max(minY, Math.min(newY, maxY));
      
      event.preventDefault();
    }
  }

  onDragEnd(event: MouseEvent | TouchEvent) {
    this.isDragging = false;
    
    document.removeEventListener('mousemove', this.boundDragMove);
    document.removeEventListener('mouseup', this.boundDragEnd);
    document.removeEventListener('touchmove', this.boundDragMove);
    document.removeEventListener('touchend', this.boundDragEnd);
    
    // Snap to edges only if actually dragged
    if (this.hasDragged) {
      const centerX = window.innerWidth / 2;
      if (this.position.x < centerX) {
        this.position.x = 24; // Snap to left
      } else {
        this.position.x = window.innerWidth - 96; // Snap to right
      }
      
      // Reset hasDragged after a short delay to prevent click
      setTimeout(() => {
        this.hasDragged = false;
      }, 200);
    }
  }

  getChatbotStyle() {
    if (typeof window === 'undefined') {
      return {};
    }
    
    return {
      'right': this.position.x > window.innerWidth / 2 ? `${window.innerWidth - this.position.x - 72}px` : 'auto',
      'left': this.position.x <= window.innerWidth / 2 ? `${this.position.x}px` : 'auto',
      'bottom': `${window.innerHeight - this.position.y - 72}px`,
      'cursor': this.isDragging ? 'grabbing' : 'grab'
    };
  }

  setInitialPosition() {
    if (typeof window !== 'undefined') {
      this.position = { x: window.innerWidth - 96, y: window.innerHeight - 96 };
    }
  }

  addOrientationListener() {
    window.addEventListener('resize', () => {
      this.adjustPositionOnResize();
    });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.adjustPositionOnResize();
      }, 100);
    });
  }

  adjustPositionOnResize() {
    const maxX = window.innerWidth - 72;
    const maxY = window.innerHeight - 72;
    const minY = 80; // Navbar height + margin
    
    if (this.position.x > maxX) {
      this.position.x = maxX;
    }
    
    if (this.position.y > maxY) {
      this.position.y = maxY;
    }
    
    if (this.position.x < 0) {
      this.position.x = 24;
    }
    
    if (this.position.y < minY) {
      this.position.y = minY;
    }
  }

  onChatClick(event: Event) {
    if (!this.isDragging && !this.hasDragged) {
      event.preventDefault();
      event.stopPropagation();
      this.toggleChat();
      this.triggerHologramEffect();
    }
  }

  onMouseDown(event: MouseEvent) {
    this.onDragStart(event);
    event.preventDefault();
  }

  // Advanced AI methods
  private initializeAdvancedFeatures(): void {
    this.setupNeuralNetwork();
    this.initializePersonalityMatrix();
    this.loadChatPreferences();
    this.setupPredictiveAnalytics();
  }

  private setupNeuralNetwork(): void {
    this.intelligenceLevel = 95 + Math.random() * 5;
    this.responseAccuracy = 96 + Math.random() * 4;
  }

  private initializePersonalityMatrix(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.aiPersonality = 'professional';
    else if (hour < 18) this.aiPersonality = 'friendly';
    else this.aiPersonality = 'technical';
  }

  private setupPredictiveAnalytics(): void {
    this.autoComplete = [
      'Preciso de um site',
      'Quanto custa um app',
      'Serviços de cloud',
      'Consultoria em IA',
      'Desenvolvimento web'
    ];
    this.smartSuggestions = [
      'Preciso de um site',
      'Quanto custa um app',
      'Serviços de cloud',
      'Consultoria em IA',
      'Desenvolvimento web',
      'Orçamento personalizado',
      'Falar com especialista'
    ];
  }



  // Performance monitoring
  private startPerformanceMonitoring(): void {
    const performanceInterval = interval(1000).subscribe(() => {
      this.systemLoad = Math.random() * 20 + 5;
      this.memoryUsage = Math.random() * 30 + 40;
      this.updateConnectionQuality();
    });
    
    this.subscriptions.push(performanceInterval);
  }

  private stopPerformanceMonitoring(): void {
    // Cleanup handled in ngOnDestroy
  }

  private updateConnectionQuality(): void {
    const latency = this.responseLatency;
    if (latency < 500) this.connectionQuality = 'excellent';
    else if (latency < 1500) this.connectionQuality = 'good';
    else this.connectionQuality = 'poor';
  }

  // Animation and effects
  private initializeParticleSystem(): void {
    this.particleEffect = true;
  }

  private setupAdvancedAnimations(): void {
    this.animationsEnabled = true;
    this.glowIntensity = 0.8;
  }

  private triggerPulseAnimation(): void {
    this.pulseState = 'pulse';
    setTimeout(() => this.pulseState = '', 200);
  }

  private triggerHologramEffect(): void {
    this.hologramMode = true;
    setTimeout(() => this.hologramMode = false, 1000);
  }

  private playNotificationSound(): void {
    if (this.soundEnabled) {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
      audio.play().catch(() => {});
    }
  }

  // Session management
  private startSessionTimer(): void {
    const sessionInterval = interval(1000).subscribe(() => {
      this.sessionDuration++;
      this.lastActivity = new Date();
    });
    
    this.subscriptions.push(sessionInterval);
  }

  // Advanced UI methods
  toggleTheme(): void {
    const themes = ['light', 'dark', 'neon', 'minimal'];
    const currentIndex = themes.indexOf(this.theme);
    this.theme = themes[(currentIndex + 1) % themes.length] as any;
  }

  toggleChatStyle(): void {
    const styles = ['modern', 'classic', 'futuristic'];
    const currentIndex = styles.indexOf(this.chatStyle);
    this.chatStyle = styles[(currentIndex + 1) % styles.length] as any;
  }

  toggleCompactMode(): void {
    this.compactMode = !this.compactMode;
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'k':
          event.preventDefault();
          this.toggleSearch();
          break;
        case 'm':
          event.preventDefault();
          this.toggleChat();
          break;

        case 't':
          event.preventDefault();
          this.toggleTheme();
          break;
      }
    }
    
    if (event.key === 'Escape') {
      this.showSearch = false;
      this.showSettings = false;
      this.showAnalytics = false;
    }
  }

  // Advanced settings
  private saveUserPreferences(): void {
    const preferences = {
      theme: this.theme,
      aiPersonality: this.aiPersonality,
      conversationMode: this.conversationMode,

      soundEnabled: this.soundEnabled,
      animationsEnabled: this.animationsEnabled
    };
    
    localStorage.setItem('ars-machina-chat-preferences', JSON.stringify(preferences));
  }

  private loadChatPreferences(): void {
    const saved = localStorage.getItem('ars-machina-chat-preferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      Object.assign(this, preferences);
    }
    this.loadUserPreferences();
  }

  // Advanced search methods
  performAdvancedSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMessages = this.messages;
      this.searchResults = [];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.searchResults = this.messages.filter(msg => 
      msg.message.toLowerCase().includes(query) ||
      (msg.metadata && JSON.stringify(msg.metadata).toLowerCase().includes(query))
    );
    
    this.filteredMessages = this.searchResults;
    this.currentSearchIndex = 0;
  }

  navigateSearchResults(direction: 'next' | 'prev'): void {
    if (this.searchResults.length === 0) return;
    
    if (direction === 'next') {
      this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchResults.length;
    } else {
      this.currentSearchIndex = this.currentSearchIndex === 0 
        ? this.searchResults.length - 1 
        : this.currentSearchIndex - 1;
    }
    
    this.highlightedMessageId = this.searchResults[this.currentSearchIndex].id;
    this.scrollToMessage(this.highlightedMessageId);
  }

  private scrollToMessage(messageId: string): void {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getAutoCompleteSuggestions(): string[] {
    if (!this.currentMessage.trim()) return [];
    
    return this.smartSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(this.currentMessage.toLowerCase())
    ).slice(0, 3);
  }

  selectAutoComplete(suggestion: string): void {
    this.currentMessage = suggestion;
    this.userInput = suggestion;
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  updateAIPersonality(personality: 'professional' | 'friendly' | 'technical'): void {
    this.aiPersonality = personality;
    this.saveUserPreferences();
  }

  updateConversationMode(mode: 'sales' | 'support' | 'consultation'): void {
    this.conversationMode = mode;
    this.saveUserPreferences();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredMessages = this.messages;
    this.searchResults = [];
    this.showSearch = false;
    this.highlightedMessageId = '';
  }

  // Métodos para melhorar interação
  private detectUserName(message: string): void {
    const namePatterns = [
      /meu nome é ([a-záàâãéèêíïóôõöúçñ]+)/i,
      /me chamo ([a-záàâãéèêíïóôõöúçñ]+)/i,
      /sou o? ([a-záàâãéèêíïóôõöúçñ]+)/i,
      /i'm ([a-z]+)/i,
      /my name is ([a-z]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        this.userName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        this.saveUserPreference('name', this.userName);
        break;
      }
    }
  }

  private updateUserActivity(): void {
    this.lastUserActivity = new Date();
    this.conversationHistory.push(new Date().toISOString());
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  private generateQuickReplies(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    if (this.userLanguage === 'en') {
      if (lowerMessage.includes('price') || lowerMessage.includes('budget')) {
        this.quickReplies = [
          'Professional website',
          'Complete e-commerce',
          'Mobile app',
          'Free consultation'
        ];
      } else if (lowerMessage.includes('service') || lowerMessage.includes('development')) {
        this.quickReplies = [
          'Web development',
          'Mobile apps',
          'Cloud computing',
          'Cybersecurity'
        ];
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('talk')) {
        this.quickReplies = [
          'WhatsApp',
          'Email',
          'Schedule meeting',
          'Phone'
        ];
      } else {
        this.quickReplies = [
          'View services',
          'Request quote',
          'Talk to specialist',
          'About company'
        ];
      }
    } else {
      if (lowerMessage.includes('preço') || lowerMessage.includes('orçamento')) {
        this.quickReplies = [
          'Site profissional',
          'E-commerce completo',
          'App mobile',
          'Consultoria gratuita'
        ];
      } else if (lowerMessage.includes('serviço') || lowerMessage.includes('desenvolvimento')) {
        this.quickReplies = [
          'Desenvolvimento web',
          'Apps mobile',
          'Cloud computing',
          'Cibersegurança'
        ];
      } else if (lowerMessage.includes('contato') || lowerMessage.includes('falar')) {
        this.quickReplies = [
          'WhatsApp',
          'Email',
          'Agendar reunião',
          'Telefone'
        ];
      } else {
        this.quickReplies = [
          'Ver serviços',
          'Solicitar orçamento',
          'Falar com especialista',
          'Sobre a empresa'
        ];
      }
    }
  }

  onQuickReplySelect(reply: string): void {
    this.userInput = reply;
    this.showQuickReplies = false;
    this.sendMessage();
  }

  private detectAndSetLanguage(message: string): void {
    // Verifica periodicamente se o idioma mudou
    try {
      const currentServiceLang = this.translationService.getCurrentLanguage();
      if (currentServiceLang && currentServiceLang !== this.userLanguage) {
        this.userLanguage = currentServiceLang === 'en' ? 'en' : 'pt';
        this.saveUserPreference('language', this.userLanguage);
        console.log('Language updated from service:', this.userLanguage);
      }
    } catch (error) {
      // Fallback se o método não existir
      console.log('Translation service method not available');
    }
  }

  private saveUserPreference(key: string, value: any): void {
    this.userPreferences[key] = value;
    localStorage.setItem('ars-machina-user-prefs', JSON.stringify(this.userPreferences));
  }

  private loadUserPreferences(): void {
    const saved = localStorage.getItem('ars-machina-user-prefs');
    if (saved) {
      this.userPreferences = JSON.parse(saved);
      this.userName = this.userPreferences.name || '';
      this.userLanguage = this.userPreferences.language || 'pt';
    }
  }

  getPersonalizedGreeting(): string {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (this.userLanguage === 'en') {
      if (hour < 12) timeGreeting = 'Good morning';
      else if (hour < 18) timeGreeting = 'Good afternoon';
      else timeGreeting = 'Good evening';
    } else {
      if (hour < 12) timeGreeting = 'Bom dia';
      else if (hour < 18) timeGreeting = 'Boa tarde';
      else timeGreeting = 'Boa noite';
    }
    
    return this.userName ? `${timeGreeting}, ${this.userName}!` : `${timeGreeting}!`;
  }

  showTypingIndicator(): void {
    this.isTyping = true;
    setTimeout(() => this.isTyping = false, 2000);
  }

  getContextualResponse(message: string): string {
    const context = this.conversationFlow.slice(-3).join(' ').toLowerCase();
    
    if (this.userLanguage === 'en') {
      if (context.includes('price') && message.toLowerCase().includes('expensive')) {
        return 'I understand your concern about the investment. We offer various payment options and our average ROI is 300% in 12 months. How about a free consultation to evaluate your specific case?';
      }
      
      if (context.includes('service') && message.toLowerCase().includes('time')) {
        return 'Our projects follow agile methodology with weekly deliveries. A professional website is ready in 2-4 weeks, while more complex systems can take 2-6 months. Can I detail the timeline for your specific project?';
      }
    } else {
      if (context.includes('preço') && message.toLowerCase().includes('caro')) {
        return 'Entendo sua preocupação com o investimento. Oferecemos várias opções de pagamento e nosso ROI médio é de 300% em 12 meses. Que tal uma consultoria gratuita para avaliarmos seu caso específico?';
      }
      
      if (context.includes('serviço') && message.toLowerCase().includes('tempo')) {
        return 'Nossos projetos seguem metodologia ágil com entregas semanais. Um site profissional fica pronto em 2-4 semanas, enquanto sistemas mais complexos podem levar 2-6 meses. Posso detalhar o cronograma do seu projeto específico?';
      }
    }
    
    return this.getBusinessResponse(message);
  }

  private getUserLanguagePreference(): void {
    // Verifica se há idioma salvo nas preferências
    const savedLang = this.userPreferences.language;
    if (savedLang) {
      this.userLanguage = savedLang;
      console.log('Loaded saved language:', this.userLanguage);
      return;
    }

    // Tenta verificar idioma do serviço de tradução
    try {
      const currentLang = this.translationService.getCurrentLanguage();
      if (currentLang) {
        this.userLanguage = currentLang === 'en' ? 'en' : 'pt';
        this.saveUserPreference('language', this.userLanguage);
        console.log('Language from translation service:', this.userLanguage);
        return;
      }
    } catch (error) {
      console.log('Translation service not available, using browser language');
    }

    // Fallback para idioma do navegador
    const browserLang = navigator.language || (navigator as any).userLanguage;
    this.userLanguage = browserLang.startsWith('en') ? 'en' : 'pt';
    this.saveUserPreference('language', this.userLanguage);
    console.log('Browser language detected:', this.userLanguage);
  }

  setLanguage(lang: 'pt' | 'en'): void {
    this.userLanguage = lang;
    this.saveUserPreference('language', this.userLanguage);
    // Tenta atualizar o serviço de tradução também
    try {
      this.translationService.setLanguage(lang);
    } catch (error) {
      console.log('Translation service setLanguage not available');
    }
    console.log('Language manually set to:', this.userLanguage);
  }

  // Método público para forçar atualização do idioma
  updateLanguageFromProfile(): void {
    this.getUserLanguagePreference();
  }
}