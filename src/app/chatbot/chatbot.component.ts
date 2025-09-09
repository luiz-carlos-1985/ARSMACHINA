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
  showWhatsAppButton: boolean = false;
  selectedService: string = '';
  
  searchQuery: string = '';
  highlightedMessageId: string = '';
  typingSpeed: string = 'normal';
  soundEnabled: boolean = true;
  theme: string = 'light';
  feedbackRating: number = 0;
  feedbackText: string = '';
  

  currentGreeting: string = '';
  currentTypingText: string = '';
  
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

    const message = this.userInput.trim();
    this.userInput = '';
    this.isLoading = true;

    // Verifica se o usuário mencionou algum serviço
    this.checkForServiceMention(message);

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
    this.scrollToBottom();
    
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
      this.currentTypingText = '';
      this.scrollToBottom();
    }, 1500);
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
    const isEnglish = this.detectEnglish(message);
    
    // Mensagem inicial atrativa mostrando serviços - apenas para saudações
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('hello') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
      return `🎯 **Excelente! Você está falando com o especialista certo.**\n\n` +
             `Sou consultor sênior da **Ars Machina Consultancy** - referência em transformação digital corporativa.\n\n` +
             `📊 **NOSSOS RESULTADOS COMPROVADOS:**\n` +
             `✅ **+200 empresas** transformadas digitalmente\n` +
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
    
    if (lowerMessage.includes('serviços') || lowerMessage.includes('servicos') || lowerMessage.includes('desenvolvimento')) {
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
    
    if (lowerMessage.includes('ideia') || lowerMessage.includes('projeto') || lowerMessage.includes('startup')) {
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
      return `🤖 **Hello! I'm your digital consultant from Ars Machina!**\n\n` +
             `We're here to **revolutionize your business** with cutting-edge technology!\n\n` +
             `💻 Type **'services'** - See our complete portfolio\n` +
             `💰 Type **'pricing'** - Learn about our packages\n` +
             `💡 Type **'idea'** - Transform your idea into a project\n` +
             `📞 Type **'contact'** - Speak with a specialist\n\n` +
             `🏆 **WHY CHOOSE ARS MACHINA?**\n` +
             `✅ +200 successfully delivered projects\n` +
             `✅ Specialized and certified team\n` +
             `✅ Proven agile methodology\n` +
             `✅ 24/7 technical support\n` +
             `✅ Quality guarantee\n\n` +
             `**Ready to start your digital transformation now?**`;
    }
    return `🤖 **Olá! Sou seu consultor digital da Ars Machina!**\n\n` +
           `Estamos aqui para **revolucionar seu negócio** com tecnologia de ponta!\n\n` +
           `💻 Digite **'serviços'** - Ver nosso portfólio completo\n` +
           `💰 Digite **'preços'** - Conhecer nossos pacotes\n` +
           `💡 Digite **'ideia'** - Transformar sua ideia em projeto\n` +
           `📞 Digite **'contato'** - Falar com especialista\n\n` +
           `🏆 **POR QUE ESCOLHER A ARS MACHINA?**\n` +
           `✅ +200 projetos entregues com sucesso\n` +
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
      const greetings = [
        '👋 Olá! Como posso ajudar?',
        '🤖 Oi! Sou sua IA assistente!',
        '💡 Pronto para inovar juntos?',
        '🎆 Vamos transformar sua ideia?',
        '🚀 Que tal começar um projeto?'
      ];
      this.currentGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    }
    return this.currentGreeting;
  }

  getResponseTime(): string {
    return 'Resposta em ~2s';
  }

  getTypingText(): string {
    if (!this.currentTypingText) {
      const typingTexts = [
        '🧠 Analisando sua mensagem...',
        '🔍 Processando informações...',
        '⚙️ Gerando resposta inteligente...',
        '💡 Preparando solução personalizada...',
        '🎯 Otimizando resposta para você...'
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
    const englishWords = ['hello', 'hi', 'good', 'morning', 'afternoon', 'evening', 'services', 'development', 'portfolio', 'price', 'cost', 'pricing', 'budget', 'quote', 'contact', 'talk', 'speak', 'consultant', 'help', 'can', 'you', 'what', 'how', 'when', 'where', 'why', 'the', 'and', 'or', 'but', 'with', 'for', 'from', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'];
    const words = message.toLowerCase().split(/\s+/);
    const englishWordCount = words.filter(word => englishWords.includes(word)).length;
    return englishWordCount >= 2 || message.toLowerCase().includes('hello') || message.toLowerCase().includes('services') || message.toLowerCase().includes('development');
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
}