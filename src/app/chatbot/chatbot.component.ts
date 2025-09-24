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
    ])
  ]
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // Core properties
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
  unreadCount: number = 0;
  isOnline: boolean = true;
  showSearch: boolean = false;
  searchQuery: string = '';
  userLanguage: 'pt' | 'en' = 'pt';
  userName: string = '';
  userPreferences: any = {};
  currentGreeting: string = '';
  
  // Menu system
  showMainMenu: boolean = false;
  showQuickMenu: boolean = true;
  menuItems: any[] = [];
  quickMenuButtons: any[] = [];
  activeMenuSection: string = 'services';
  
  // UI features
  showWhatsAppButton: boolean = false;
  selectedService: string = '';
  userSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  conversationFlow: string[] = [];
  suggestedResponses: string[] = [];
  
  // Positioning
  isDragging: boolean = false;
  dragOffset = { x: 0, y: 0 };
  position = { x: 24, y: 24 };
  hasDragged: boolean = false;
  dragStartPos = { x: 0, y: 0 };
  
  // Settings
  theme: 'light' | 'dark' | 'neon' = 'neon';
  soundEnabled: boolean = true;
  animationsEnabled: boolean = true;
  aiPersonality: 'professional' | 'friendly' | 'technical' = 'friendly';
  conversationMode: 'sales' | 'support' | 'consultation' = 'sales';
  
  // Advanced features
  sessionDuration: number = 0;
  messageCount: number = 0;
  pulseState: string = '';
  showWelcomeCard: boolean = true;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private chatbotAiService: ChatbotAiService,
    public translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isMinimized = true;
    this.showInfoBalloon = true;
    this.setInitialPosition();
    
    // Sincroniza com o idioma da navegação PRIMEIRO
    const navLanguage = this.translationService.getCurrentLanguage();
    console.log('Navigation language detected:', navLanguage);
    this.userLanguage = (navLanguage === 'en' || navLanguage === 'pt') ? navLanguage : 'pt';
    console.log('Chatbot language set to:', this.userLanguage);
    
    this.getUserLanguagePreference();
    this.updateGreeting(); // Inicializa a saudação
    console.log('Initial greeting set to:', this.currentGreeting);
    
    this.initializeSubscriptions();
    this.initializeMenuSystem();
    this.setupDragListeners();
    this.showQuickMenu = true;
    setTimeout(() => this.showInfoBalloon = false, 8000);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeSubscriptions(): void {
    const historySubscription = this.chatbotAiService.getConversationHistory().subscribe(
      messages => {
        if (messages.length === 0) {
          // Adiciona mensagem inicial no idioma correto
          const welcomeMessage = {
            id: 'welcome_' + Date.now(),
            sender: 'bot' as const,
            message: this.userLanguage === 'en'
              ? '👋 Hello! I\'m the intelligent assistant from Ars Machina Consultancy. How can I help you today?'
              : '👋 Olá! Eu sou o assistente inteligente da Ars Machina Consultancy. Como posso ajudar você hoje?',
            timestamp: new Date(),
            type: 'text' as const
          };
          this.messages = [welcomeMessage];
        } else {
          this.messages = messages;
        }
        this.filteredMessages = [...this.messages];
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
      this.showQuickMenu = true;
    } else {
      this.showMainMenu = false;
    }
  }

  openChat() {
    this.isMinimized = false;
    this.showInfoBalloon = false;
    this.unreadCount = 0;
    this.showQuickMenu = true;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom() {
    if (this.chatContainer?.nativeElement) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const message = this.userInput.trim();
    this.detectEnglish(message);
    this.userInput = '';
    this.isLoading = true;
    this.typingText = '';
    this.messageCount++;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      message: message,
      timestamp: new Date(),
      type: 'text'
    };
    
    this.messages.push(userMsg);
    this.filteredMessages = [...this.messages];
    this.scrollToBottom();
    
    try {
      const response = await this.generateResponse(message);
      
      const botResponse: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        message: response,
        timestamp: new Date(),
        type: 'text'
      };
      
      setTimeout(() => {
        this.messages.push(botResponse);
        this.filteredMessages = [...this.messages];
        this.isLoading = false;
        this.scrollToBottom();
        this.checkForServiceMention(message);
        this.cdr.detectChanges();
      }, 1000);
      
    } catch (error) {
      console.error('Error generating response:', error);
      this.isLoading = false;
    }
  }

  private async generateResponse(message: string): Promise<string> {
    return this.getBusinessResponse(message);
  }

  getBusinessResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    const isEnglish = this.userLanguage === 'en';
    const greeting = this.userName ? `${this.userName}, ` : '';

    // Serviços
    if (lowerMessage.includes('serviços') || lowerMessage.includes('services') || lowerMessage.includes('desenvolvimento') || lowerMessage.includes('development')) {
      if (isEnglish) {
        return `🛠️ **Our Complete Services Portfolio:**\n\n` +
               `🌐 **Web Development**\n` +
               `• Professional websites and web applications\n` +
               `• E-commerce platforms with payment integration\n` +
               `• Custom management systems\n\n` +
               `📱 **Mobile Development**\n` +
               `• Native iOS and Android apps\n` +
               `• Cross-platform solutions\n` +
               `• App Store optimization\n\n` +
               `☁️ **Cloud Solutions**\n` +
               `• AWS, Azure, Google Cloud\n` +
               `• DevOps and CI/CD\n` +
               `• Scalable infrastructure\n\n` +
               `🔒 **Cybersecurity**\n` +
               `• Security audits and compliance\n` +
               `• Data protection solutions\n\n` +
               `**Ready to start your project?**`;
      }
      return `🛠️ **Nosso Portfólio Completo de Serviços:**\n\n` +
             `🌐 **Desenvolvimento Web**\n` +
             `• Sites profissionais e aplicações web\n` +
             `• Plataformas e-commerce com integração de pagamento\n` +
             `• Sistemas de gestão customizados\n\n` +
             `📱 **Desenvolvimento Mobile**\n` +
             `• Apps nativos iOS e Android\n` +
             `• Soluções cross-platform\n` +
             `• Otimização para App Store\n\n` +
             `☁️ **Soluções Cloud**\n` +
             `• AWS, Azure, Google Cloud\n` +
             `• DevOps e CI/CD\n` +
             `• Infraestrutura escalável\n\n` +
             `🔒 **Cibersegurança**\n` +
             `• Auditorias de segurança e compliance\n` +
             `• Soluções de proteção de dados\n\n` +
             `**Pronto para começar seu projeto?**`;
    }

    // Preços
    if (lowerMessage.includes('preço') || lowerMessage.includes('price') || lowerMessage.includes('custo') || lowerMessage.includes('orçamento') || lowerMessage.includes('pricing')) {
      if (isEnglish) {
        return `💰 **Investment & Pricing:**\n\n` +
               `💻 **Professional Website**\n` +
               `From $8,000 - Complete solution\n\n` +
               `🛒 **E-commerce Platform**\n` +
               `From $15,000 - Full online store\n\n` +
               `📱 **Mobile Application**\n` +
               `From $25,000 - iOS + Android\n\n` +
               `☁️ **Cloud Solutions**\n` +
               `Custom quote based on needs\n\n` +
               `🎯 **FREE CONSULTATION**\n` +
               `• Complete project analysis\n` +
               `• Detailed technical proposal\n` +
               `• No-obligation quote\n\n` +
               `**Want a personalized quote?**`;
      }
      return `💰 **Investimento & Preços:**\n\n` +
             `💻 **Site Profissional**\n` +
             `A partir de R$ 8.500 - Solução completa\n\n` +
             `🛒 **Plataforma E-commerce**\n` +
             `A partir de R$ 15.000 - Loja online completa\n\n` +
             `📱 **Aplicativo Mobile**\n` +
             `A partir de R$ 25.000 - iOS + Android\n\n` +
             `☁️ **Soluções Cloud**\n` +
             `Orçamento personalizado conforme necessidade\n\n` +
             `🎯 **CONSULTORIA GRATUITA**\n` +
             `• Análise completa do projeto\n` +
             `• Proposta técnica detalhada\n` +
             `• Orçamento sem compromisso\n\n` +
             `**Quer um orçamento personalizado?**`;
    }

    // Contato
    if (lowerMessage.includes('contato') || lowerMessage.includes('contact') || lowerMessage.includes('falar') || lowerMessage.includes('whatsapp') || lowerMessage.includes('touch')) {
      if (isEnglish) {
        return `📞 **Contact Us - VIP Service:**\n\n` +
               `📱 **WhatsApp:** +55 98 99964-9215\n` +
               `⚡ Response within 30 minutes\n\n` +
               `📧 **Email:** contact@arsmachinaconsultancy.com\n` +
               `⏰ Response within 2 business hours\n\n` +
               `🏢 **Office São Luís/Brazil:**\n` +
               `📍 In-person meetings available\n\n` +
               `**Prefer WhatsApp or email?**`;
      }
      return `📞 **Fale Conosco - Atendimento VIP:**\n\n` +
             `📱 **WhatsApp:** +55 98 99964-9215\n` +
             `⚡ Resposta em até 30 minutos\n\n` +
             `📧 **Email:** contato@arsmachinaconsultancy.com\n` +
             `⏰ Resposta em até 2 horas úteis\n\n` +
             `🏢 **Escritório São Luís/MA:**\n` +
             `📍 Atendimento presencial disponível\n\n` +
             `**Prefere WhatsApp ou email?**`;
    }

    // Portfolio
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('trabalhos') || lowerMessage.includes('projetos') || lowerMessage.includes('cases')) {
      if (isEnglish) {
        return `🎨 **Our Success Portfolio:**\n\n` +
               `🏆 **Featured Projects:**\n` +
               `• E-commerce that earned $2M in first year\n` +
               `• Mobile app with +50k downloads\n` +
               `• System that reduced costs by 60%\n` +
               `• Cloud infrastructure serving 1M+ users\n\n` +
               `💼 **Industries We Serve:**\n` +
               `• Retail & E-commerce\n` +
               `• Healthcare & Telemedicine\n` +
               `• Education & EdTech\n` +
               `• Finance & FinTech\n\n` +
               `**Want to see specific case studies?**`;
      }
      return `🎨 **Nosso Portfolio de Sucesso:**\n\n` +
             `🏆 **Projetos Destaque:**\n` +
             `• E-commerce que faturou R$ 2M no primeiro ano\n` +
             `• App mobile com +50k downloads\n` +
             `• Sistema que reduziu custos em 60%\n` +
             `• Infraestrutura cloud atendendo 1M+ usuários\n\n` +
             `💼 **Setores que Atendemos:**\n` +
             `• Varejo & E-commerce\n` +
             `• Saúde & Telemedicina\n` +
             `• Educação & EdTech\n` +
             `• Finanças & FinTech\n\n` +
             `**Quer ver cases específicos?**`;
    }

    // Resposta padrão
    if (isEnglish) {
      return `🤖 **Hello${this.userName ? ' ' + this.userName : ''}! I'm your AI consultant from Ars Machina!**\n\n` +
             `We're here to **revolutionize your business** with cutting-edge technology!\n\n` +
             `💻 Type **'services'** - See our complete portfolio\n` +
             `💰 Type **'pricing'** - Learn about our packages\n` +
             `📞 Type **'contact'** - Speak with a specialist\n` +
             `🎨 Type **'portfolio'** - See our success cases\n\n` +
             `**Ready to start your digital transformation?**`;
    }
    return `🤖 **${greeting}Olá! Sou seu consultor de IA da Ars Machina!**\n\n` +
           `Estamos aqui para **revolucionar seu negócio** com tecnologia de ponta!\n\n` +
           `💻 Digite **'serviços'** - Ver nosso portfólio completo\n` +
           `💰 Digite **'preços'** - Conhecer nossos pacotes\n` +
           `📞 Digite **'contato'** - Falar com especialista\n` +
           `🎨 Digite **'portfolio'** - Ver nossos cases de sucesso\n\n` +
           `**Vamos começar sua transformação digital?**`;
  }

  // Quick action method
  quickAction(action: string): void {
    let message = '';
    
    switch (action) {
      case 'services':
        message = this.userLanguage === 'en' ? 'Tell me about your services' : 'Conte-me sobre seus serviços';
        break;
      case 'pricing':
        message = this.userLanguage === 'en' ? 'I need pricing information' : 'Preciso de informações sobre preços';
        break;
      case 'contact':
        message = this.userLanguage === 'en' ? 'I need contact information' : 'Preciso de informações de contato';
        break;
      case 'portfolio':
        message = this.userLanguage === 'en' ? 'Show me your portfolio' : 'Mostre-me seu portfolio';
        break;
      default:
        message = action;
    }
    
    this.userInput = message;
    this.sendMessage();
  }

  // Menu system methods
  private initializeMenuSystem(): void {
    this.generateMainMenu();
    this.generateQuickMenuButtons();
  }

  private generateMainMenu(): void {
    this.menuItems = [
      {
        id: 'services',
        icon: '🛠️',
        title: this.userLanguage === 'en' ? 'Our Services' : 'Nossos Serviços',
        subtitle: this.userLanguage === 'en' ? 'Explore what we offer' : 'Explore o que oferecemos'
      },
      {
        id: 'pricing',
        icon: '💰',
        title: this.userLanguage === 'en' ? 'Pricing' : 'Preços',
        subtitle: this.userLanguage === 'en' ? 'Get your estimate' : 'Obtenha sua estimativa'
      }
    ];
  }

  private generateQuickMenuButtons(): void {
    this.quickMenuButtons = this.userLanguage === 'en' ? [
      { id: 'services', icon: '🛠️', title: 'Services', action: 'services' },
      { id: 'pricing', icon: '💰', title: 'Pricing', action: 'pricing' },
      { id: 'contact', icon: '📞', title: 'Contact', action: 'contact' },
      { id: 'portfolio', icon: '🎨', title: 'Portfolio', action: 'portfolio' }
    ] : [
      { id: 'services', icon: '🛠️', title: 'Serviços', action: 'services' },
      { id: 'pricing', icon: '💰', title: 'Preços', action: 'pricing' },
      { id: 'contact', icon: '📞', title: 'Contato', action: 'contact' },
      { id: 'portfolio', icon: '🎨', title: 'Portfolio', action: 'portfolio' }
    ];
  }

  // Utility methods
  formatMessageText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  getChatbotStyle(): any {
    return {
      bottom: this.position.y + 'px',
      right: this.position.x + 'px'
    };
  }

  onChatClick(event: Event): void {
    if (!this.hasDragged) {
      this.toggleChat();
    }
    this.hasDragged = false;
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStartPos = { x: event.clientX, y: event.clientY };
    this.dragOffset = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y
    };
  }

  onDragStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.isDragging = true;
    this.dragStartPos = { x: touch.clientX, y: touch.clientY };
    this.dragOffset = {
      x: touch.clientX - this.position.x,
      y: touch.clientY - this.position.y
    };
  }

  checkForServiceMention(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('contato') || lowerMessage.includes('contact') || lowerMessage.includes('falar') || lowerMessage.includes('whatsapp')) {
      this.selectedService = this.userLanguage === 'en' ? 'Contact' : 'Contato';
      this.showWhatsAppButton = true;
    }
  }

  openWhatsApp(): void {
    const phoneNumber = '5598999649215';
    const message = `Olá! Tenho interesse nos serviços da Ars Machina. Gostaria de mais informações.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  openGitHub(): void {
    window.open('https://github.com/luiz-carlos-1985/', '_blank');
  }

  // Método temporário para testar mudança de idioma
  toggleLanguage(): void {
    this.userLanguage = this.userLanguage === 'en' ? 'pt' : 'en';
    this.saveUserPreferences();
    this.initializeMenuSystem();
    
    // Atualiza a saudação
    this.updateGreeting();
    
    // Atualiza a mensagem inicial se existir
    if (this.messages.length > 0 && this.messages[0].sender === 'bot') {
      this.messages[0].message = this.userLanguage === 'en'
        ? '👋 Hello! I\'m the intelligent assistant from Ars Machina Consultancy. How can I help you today?'
        : '👋 Olá! Eu sou o assistente inteligente da Ars Machina Consultancy. Como posso ajudar você hoje?';
      this.filteredMessages = [...this.messages];
    }
    
    // Também atualiza o serviço de tradução
    this.translationService.setLanguage(this.userLanguage);
    
    this.cdr.detectChanges();
    console.log('Language toggled to:', this.userLanguage);
    console.log('Current greeting:', this.currentGreeting);
  }

  exportConversation(): void {
    const conversation = this.messages.map(msg => 
      `${msg.sender === 'user' ? 'Usuário' : 'Ars Machina'}: ${msg.message}`
    ).join('\n\n');
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversa-ars-machina-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  clearConversation(): void {
    if (confirm(this.userLanguage === 'en' ? 'Clear conversation?' : 'Limpar conversa?')) {
      this.messages = [];
      this.filteredMessages = [];
      this.showWelcomeCard = true;
    }
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  searchMessages(): void {
    if (!this.searchQuery.trim()) {
      this.filteredMessages = this.messages;
      return;
    }
    this.filteredMessages = this.messages.filter(msg => 
      msg.message.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredMessages = this.messages;
    this.showSearch = false;
  }

  detectEnglish(message: string): boolean {
    const englishWords = ['hello', 'hi', 'services', 'development', 'price', 'contact', 'portfolio', 'help', 'can', 'you', 'what', 'how', 'the', 'and', 'or'];
    const words = message.toLowerCase().split(/\s+/);
    const englishWordCount = words.filter(word => englishWords.includes(word)).length;
    const isEnglish = englishWordCount >= 2;
    
    if (isEnglish && this.userLanguage !== 'en') {
      this.userLanguage = 'en';
      this.saveUserPreferences();
      this.initializeMenuSystem(); // Atualiza menus
      this.cdr.detectChanges();
      console.log('Language changed to English');
    }
    
    return isEnglish;
  }

  private saveUserPreferences(): void {
    const prefs = {
      ...this.userPreferences,
      language: this.userLanguage,
      name: this.userName
    };
    localStorage.setItem('ars-machina-user-prefs', JSON.stringify(prefs));
  }

  private getUserLanguagePreference(): void {
    // Carrega preferências do usuário (nome, etc.) mas mantém o idioma já sincronizado
    const saved = localStorage.getItem('ars-machina-user-prefs');
    if (saved) {
      this.userPreferences = JSON.parse(saved);
      this.userName = this.userPreferences.name || '';
    }
    
    // Escuta mudanças de idioma da navegação
    this.translationService.currentLanguage$.subscribe((lang: string) => {
      const validLang = (lang === 'en' || lang === 'pt') ? lang : 'pt';
      if (validLang !== this.userLanguage) {
        this.userLanguage = validLang;
        this.updateGreeting();
        this.saveUserPreferences();
        this.initializeMenuSystem();
        
        // Atualiza mensagem inicial se existir
        if (this.messages.length > 0 && this.messages[0].sender === 'bot') {
          this.messages[0].message = this.userLanguage === 'en'
            ? '👋 Hello! I\'m the intelligent assistant from Ars Machina Consultancy. How can I help you today?'
            : '👋 Olá! Eu sou o assistente inteligente da Ars Machina Consultancy. Como posso ajudar você hoje?';
          this.filteredMessages = [...this.messages];
        }
        
        this.cdr.detectChanges();
        console.log('Chatbot language synced to:', this.userLanguage);
      }
    });
  }



  private setInitialPosition(): void {
    this.position = { x: 24, y: 24 };
  }

  // Métodos necessários para o template
  getRandomGreeting(): string {
    if (!this.currentGreeting) {
      this.updateGreeting();
    }
    return this.currentGreeting;
  }

  private updateGreeting(): void {
    console.log('updateGreeting called, userLanguage:', this.userLanguage);
    const greetings = this.userLanguage === 'en' ? [
      '🚀 Hello! I\'m your advanced AI consultant!',
      '🤖 Hi! Ready to revolutionize your business?',
      '💡 Welcome to the future of digital consulting!'
    ] : [
      '🚀 Olá! Sou sua IA consultora avançada!',
      '🤖 Oi! Pronto para revolucionar seu negócio?',
      '💡 Bem-vindo ao futuro da consultoria digital!'
    ];
    this.currentGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    console.log('Updated greeting to:', this.currentGreeting);
  }

  onQuickReplyClick(reply: any): void {
    this.userInput = reply.text || reply;
    this.sendMessage();
  }

  private typingText: string = '';

  getTypingText(): string {
    if (!this.typingText) {
      const texts = this.userLanguage === 'en' 
        ? ['Thinking...', 'Processing...', 'Analyzing...']
        : ['Pensando...', 'Processando...', 'Analisando...'];
      this.typingText = texts[0];
    }
    return this.typingText;
  }

  onQuickMenuButtonClick(action: string): void {
    this.quickAction(action.replace('menu-', ''));
  }

  closeMenu(): void {
    this.showMainMenu = false;
  }

  getMainMenuTitle(): string {
    return this.userLanguage === 'en' ? 'Main Menu' : 'Menu Principal';
  }

  onMenuSectionClick(sectionId: string): void {
    this.activeMenuSection = sectionId;
  }

  getActiveMenuSection(): any {
    return this.menuItems.find(item => item.id === this.activeMenuSection) || this.menuItems[0];
  }

  onMenuItemClick(action: string): void {
    this.showMainMenu = false;
    this.quickAction(action);
  }

  private setupDragListeners(): void {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', () => this.onMouseUp());
    document.addEventListener('touchmove', (e) => this.onTouchMove(e));
    document.addEventListener('touchend', () => this.onTouchEnd());
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const newX = window.innerWidth - event.clientX - 36;
      const newY = window.innerHeight - event.clientY - 36;
      
      this.position.x = Math.max(24, Math.min(newX, window.innerWidth - 96));
      this.position.y = Math.max(100, Math.min(newY, window.innerHeight - 96));
      
      const dragDistance = Math.abs(event.clientX - this.dragStartPos.x) + Math.abs(event.clientY - this.dragStartPos.y);
      if (dragDistance > 5) {
        this.hasDragged = true;
      }
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
  }

  onTouchMove(event: TouchEvent): void {
    if (this.isDragging && event.touches.length > 0) {
      const touch = event.touches[0];
      const newX = window.innerWidth - touch.clientX - 36;
      const newY = window.innerHeight - touch.clientY - 36;
      
      this.position.x = Math.max(24, Math.min(newX, window.innerWidth - 96));
      this.position.y = Math.max(100, Math.min(newY, window.innerHeight - 96));
      
      const dragDistance = Math.abs(touch.clientX - this.dragStartPos.x) + Math.abs(touch.clientY - this.dragStartPos.y);
      if (dragDistance > 5) {
        this.hasDragged = true;
      }
    }
  }

  onTouchEnd(): void {
    this.isDragging = false;
  }
}