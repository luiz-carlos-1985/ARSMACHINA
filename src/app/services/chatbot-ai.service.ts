import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'carousel' | 'action';
  metadata?: any;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  rating?: 'positive' | 'negative';
}

export interface ConversationContext {
  userId?: string;
  sessionId: string;
  topic?: string;
  userName?: string;
  userEmail?: string;
  serviceInterest?: string;
  urgency?: 'low' | 'medium' | 'high';
  previousQuestions?: string[];
  conversationStage?: 'greeting' | 'discovery' | 'qualification' | 'proposal' | 'closing';
  leadScore?: number;
  lastActivity?: Date;
  preferences?: {
    language: string;
    communicationStyle: 'formal' | 'casual';
    responseLength: 'short' | 'detailed';
  };
}

export interface QuickReply {
  text: string;
  payload: string;
  icon?: string;
}

export interface CarouselItem {
  title: string;
  subtitle: string;
  imageUrl?: string;
  buttons: QuickReply[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotAiService {
  private conversationHistory = new BehaviorSubject<ChatMessage[]>([]);
  private context = new BehaviorSubject<ConversationContext>({
    sessionId: this.generateSessionId(),
    conversationStage: 'greeting',
    leadScore: 0,
    preferences: {
      language: 'pt',
      communicationStyle: 'casual',
      responseLength: 'detailed'
    }
  });

  // Expanded knowledge base with more sophisticated content
  private knowledgeBase: {
    services: {
      [key: string]: {
        keywords: string[];
        description: string;
        technologies: string[];
        projects: string[];
        pricing: string;
        timeline: string;
      }
    };
    faqs: Array<{
      question: string;
      answer: string;
      keywords: string[];
    }>;
    companyInfo: {
      name: string;
      founded: string;
      location: string;
      team: string;
      projects: string;
      specialties: string[];
      contact: {
        email: string;
        whatsapp: string;
        website: string;
      }
    };
  } = {
    services: {
      web: {
        keywords: ['desenvolvimento web', 'sites', 'aplicações web', 'e-commerce', 'landing pages', 'frontend', 'backend', 'fullstack'],
        description: 'Desenvolvimento de aplicações web modernas e responsivas',
        technologies: ['React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'PHP'],
        projects: ['E-commerce para varejo', 'Sistema de gestão empresarial', 'Plataforma de cursos online'],
        pricing: 'A partir de R$ 5.000',
        timeline: '2-6 meses'
      },
      mobile: {
        keywords: ['apps mobile', 'aplicativos', 'ios', 'android', 'react native', 'flutter', 'app'],
        description: 'Desenvolvimento de aplicativos móveis nativos e híbridos',
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
        projects: ['App de delivery', 'App bancário', 'App de fitness'],
        pricing: 'A partir de R$ 8.000',
        timeline: '3-8 meses'
      },
      cloud: {
        keywords: ['aws', 'azure', 'google cloud', 'nuvem', 'infraestrutura', 'cloud computing', 'devops'],
        description: 'Consultoria e implementação de soluções em nuvem',
        technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
        projects: ['Migração para AWS', 'Arquitetura serverless', 'CI/CD pipeline'],
        pricing: 'A partir de R$ 3.000',
        timeline: '1-4 meses'
      },
      security: {
        keywords: ['segurança', 'cibersegurança', 'pentest', 'auditoria', 'compliance', 'lgpd'],
        description: 'Soluções completas de segurança da informação',
        technologies: ['Penetration Testing', 'SIEM', 'Firewall', 'Compliance LGPD'],
        projects: ['Auditoria de segurança', 'Implementação LGPD', 'Pentest aplicações'],
        pricing: 'A partir de R$ 4.000',
        timeline: '2-6 meses'
      },
      ai: {
        keywords: ['inteligência artificial', 'machine learning', 'ia', 'automação', 'chatbots', 'deep learning'],
        description: 'Implementação de soluções de IA e automação',
        technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn'],
        projects: ['Chatbot inteligente', 'Sistema de recomendação', 'Análise preditiva'],
        pricing: 'A partir de R$ 10.000',
        timeline: '4-12 meses'
      },
      consulting: {
        keywords: ['consultoria', 'assessoria', 'mentoria', 'treinamento', 'transformação digital'],
        description: 'Consultoria estratégica em tecnologia e transformação digital',
        technologies: ['Metodologias ágeis', 'Design Thinking', 'Lean Startup'],
        projects: ['Estratégia digital', 'Treinamento de equipes', 'Mentoria técnica'],
        pricing: 'A partir de R$ 2.000',
        timeline: '1-3 meses'
      }
    },
    
    faqs: [
      {
        question: 'Quanto tempo leva para desenvolver um projeto?',
        answer: 'O tempo varia conforme a complexidade. Projetos simples levam 1-3 meses, médios 3-6 meses, e complexos 6-12 meses. Fazemos um cronograma detalhado após análise dos requisitos.',
        keywords: ['tempo', 'prazo', 'cronograma', 'duração']
      },
      {
        question: 'Vocês oferecem suporte após a entrega?',
        answer: 'Sim! Oferecemos 3 meses de suporte gratuito após a entrega, incluindo correções de bugs e pequenos ajustes. Também temos planos de manutenção contínua.',
        keywords: ['suporte', 'manutenção', 'pós-entrega', 'garantia']
      },
      {
        question: 'Como funciona o processo de desenvolvimento?',
        answer: 'Seguimos metodologia ágil: 1) Análise de requisitos, 2) Prototipagem, 3) Desenvolvimento iterativo, 4) Testes, 5) Deploy, 6) Suporte. Você acompanha todo o processo.',
        keywords: ['processo', 'metodologia', 'desenvolvimento', 'etapas']
      },
      {
        question: 'Vocês trabalham com que tecnologias?',
        answer: 'Trabalhamos com tecnologias modernas: React, Angular, Vue.js, Node.js, Python, AWS, Azure, React Native, Flutter, e muito mais. Escolhemos a melhor stack para cada projeto.',
        keywords: ['tecnologias', 'stack', 'linguagens', 'frameworks']
      }
    ],

    companyInfo: {
      name: 'Ars Machina Consultancy',
      founded: '2023',
      location: 'São Luís, Maranhão',
      team: '30+ especialistas',
      projects: '200+ projetos entregues',
      specialties: ['Desenvolvimento Full-Stack', 'Cloud Computing', 'IA & Machine Learning', 'Cibersegurança'],
      contact: {
        email: 'contato@arsmachinaconsultancy.com',
        whatsapp: '+55 98 99964-9215',
        website: 'www.arsmachinaconsultancy.com'
      }
    }
  };

  // Sentiment analysis patterns
  private sentimentPatterns = {
    positive: ['ótimo', 'excelente', 'perfeito', 'adorei', 'fantástico', 'maravilhoso', 'incrível', 'legal', 'bom', 'gostei'],
    negative: ['ruim', 'péssimo', 'horrível', 'terrível', 'não gostei', 'problema', 'erro', 'difícil', 'complicado', 'caro'],
    neutral: ['ok', 'normal', 'regular', 'mais ou menos', 'talvez', 'não sei', 'pode ser']
  };

  // Conversation patterns for better intent recognition
  private conversationPatterns = {
    questions: ['como', 'qual', 'quando', 'onde', 'quem', 'quanto', 'por que', 'o que', 'posso', 'consigo'],
    requests: ['quero', 'preciso', 'gostaria', 'posso', 'tem como', 'é possível', 'me ajuda', 'ajude-me'],
    problems: ['problema', 'erro', 'dificuldade', 'não funciona', 'não consigo', 'bug', 'falha'],
    comparisons: ['melhor', 'comparado', 'diferença', 'versus', 'vs', 'ou', 'entre'],
    urgency: ['urgente', 'rápido', 'imediatamente', 'hoje', 'agora', 'pressa'],
    pricing: ['preço', 'custo', 'valor', 'orçamento', 'quanto custa', 'investimento'],
    timeline: ['prazo', 'tempo', 'quando', 'cronograma', 'duração']
  };

  constructor() {
    // Não inicializa automaticamente - deixa o componente controlar
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private initializeSession(): void {
    const userLanguage = this.getUserLanguage();
    const welcomeMessage: ChatMessage = {
      id: this.generateMessageId(),
      sender: 'bot',
      message: userLanguage === 'en' 
        ? '👋 Hello! I\'m the intelligent assistant from Ars Machina Consultancy. How can I help you today?'
        : '👋 Olá! Eu sou o assistente inteligente da Ars Machina Consultancy. Como posso ajudar você hoje?',
      timestamp: new Date(),
      type: 'text'
    };
    
    this.conversationHistory.next([welcomeMessage]);
  }

  private getUserLanguage(): 'pt' | 'en' {
    const saved = localStorage.getItem('ars-machina-user-prefs');
    if (saved) {
      const prefs = JSON.parse(saved);
      return prefs.language || 'pt';
    }
    return navigator.language.startsWith('en') ? 'en' : 'pt';
  }

  private generateMessageId(): string {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getConversationHistory(): Observable<ChatMessage[]> {
    return this.conversationHistory.asObservable();
  }

  getContext(): Observable<ConversationContext> {
    return this.context.asObservable();
  }

  async processMessage(userMessage: string): Promise<ChatMessage> {
    const userMsg: ChatMessage = {
      id: this.generateMessageId(),
      sender: 'user',
      message: userMessage,
      timestamp: new Date(),
      type: 'text',
      sentiment: this.analyzeSentiment(userMessage)
    };

    // Add user message to history
    const currentHistory = this.conversationHistory.value;
    this.conversationHistory.next([...currentHistory, userMsg]);

    // Update context
    this.updateContext(userMessage);

    // Generate intelligent response
    const botResponse = await this.generateIntelligentResponse(userMessage);

    // Add bot response to history
    const updatedHistory = this.conversationHistory.value;
    this.conversationHistory.next([...updatedHistory, botResponse]);

    return botResponse;
  }

  private analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
    const lowerMessage = message.toLowerCase();
    
    let positiveScore = 0;
    let negativeScore = 0;

    this.sentimentPatterns.positive.forEach(word => {
      if (lowerMessage.includes(word)) positiveScore++;
    });

    this.sentimentPatterns.negative.forEach(word => {
      if (lowerMessage.includes(word)) negativeScore++;
    });

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  private updateContext(message: string): void {
    const currentContext = this.context.value;
    const lowerMessage = message.toLowerCase();

    // Update service interest
    for (const [service, data] of Object.entries(this.knowledgeBase.services)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        currentContext.serviceInterest = service;
        break;
      }
    }

    // Update urgency
    if (this.conversationPatterns.urgency.some(word => lowerMessage.includes(word))) {
      currentContext.urgency = 'high';
    }

    // Update conversation stage
    if (currentContext.conversationStage === 'greeting' && currentContext.serviceInterest) {
      currentContext.conversationStage = 'discovery';
    }

    // Extract user name if mentioned
    const nameMatch = lowerMessage.match(/meu nome é (\w+)|me chamo (\w+)|sou (\w+)/);
    if (nameMatch) {
      currentContext.userName = nameMatch[1] || nameMatch[2] || nameMatch[3];
    }

    // Extract email if mentioned
    const emailMatch = lowerMessage.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      currentContext.userEmail = emailMatch[0];
    }

    // Update lead score
    this.updateLeadScore(currentContext, message);

    currentContext.lastActivity = new Date();
    this.context.next(currentContext);
  }

  private updateLeadScore(context: ConversationContext, message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Increase score for engagement indicators
    if (this.conversationPatterns.requests.some(word => lowerMessage.includes(word))) {
      context.leadScore = (context.leadScore || 0) + 10;
    }
    
    if (this.conversationPatterns.pricing.some(word => lowerMessage.includes(word))) {
      context.leadScore = (context.leadScore || 0) + 15;
    }
    
    if (context.userEmail) {
      context.leadScore = (context.leadScore || 0) + 20;
    }
    
    if (context.userName) {
      context.leadScore = (context.leadScore || 0) + 10;
    }
  }

  private async generateIntelligentResponse(message: string): Promise<ChatMessage> {
    const context = this.context.value;
    const intent = this.analyzeAdvancedIntent(message);
    const confidence = this.calculateConfidence(message, intent);

    let response: any = {
      id: this.generateMessageId(),
      sender: 'bot' as const,
      timestamp: new Date(),
      confidence: confidence
    };

    switch (intent) {
      case 'greeting':
        response = { ...response, ...this.handleAdvancedGreeting(context) };
        break;
      case 'service_inquiry':
        response = { ...response, ...this.handleAdvancedServiceInquiry(message, context) };
        break;
      case 'pricing':
        response = { ...response, ...this.handleAdvancedPricing(message, context) };
        break;
      case 'timeline':
        response = { ...response, ...this.handleTimelineInquiry(message, context) };
        break;
      case 'contact':
        response = { ...response, ...this.handleAdvancedContact(context) };
        break;
      case 'faq':
        response = { ...response, ...this.handleFAQ(message) };
        break;
      case 'project_details':
        response = { ...response, ...this.handleProjectDetails(message, context) };
        break;
      case 'qualification':
        response = { ...response, ...this.handleQualification(message, context) };
        break;
      default:
        response = { ...response, ...this.handleIntelligentDefault(message, context) };
    }

    return response;
  }

  private analyzeAdvancedIntent(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Advanced intent recognition with context awareness
    if (this.isGreeting(lowerMessage)) return 'greeting';
    if (this.containsKeywords(lowerMessage, this.conversationPatterns.pricing)) return 'pricing';
    if (this.containsKeywords(lowerMessage, this.conversationPatterns.timeline)) return 'timeline';
    if (this.containsKeywords(lowerMessage, ['contato', 'telefone', 'email', 'whatsapp', 'falar'])) return 'contact';
    if (this.containsKeywords(lowerMessage, ['projeto', 'desenvolvimento', 'criar', 'fazer'])) return 'project_details';
    if (this.containsKeywords(lowerMessage, ['empresa', 'equipe', 'experiência', 'sobre'])) return 'qualification';
    
    // Check for service-related keywords
    for (const [service, data] of Object.entries(this.knowledgeBase.services)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return 'service_inquiry';
      }
    }

    // Check for FAQ patterns
    if (this.knowledgeBase.faqs.some(faq => 
      faq.keywords.some(keyword => lowerMessage.includes(keyword))
    )) {
      return 'faq';
    }

    return 'default';
  }

  private calculateConfidence(message: string, intent: string): number {
    // Simple confidence calculation based on keyword matches
    const lowerMessage = message.toLowerCase();
    let matches = 0;
    let totalKeywords = 0;

    switch (intent) {
      case 'service_inquiry':
        for (const [service, data] of Object.entries(this.knowledgeBase.services)) {
          totalKeywords += data.keywords.length;
          matches += data.keywords.filter(keyword => lowerMessage.includes(keyword)).length;
        }
        break;
      case 'pricing':
        totalKeywords = this.conversationPatterns.pricing.length;
        matches = this.conversationPatterns.pricing.filter(keyword => lowerMessage.includes(keyword)).length;
        break;
      // Add more cases as needed
    }

    return totalKeywords > 0 ? Math.min((matches / totalKeywords) * 100, 95) : 70;
  }

  private isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi', 'hey'];
    return greetings.some(greeting => message.includes(greeting)) && message.length < 50;
  }

  private containsKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private handleAdvancedGreeting(context: ConversationContext): Partial<ChatMessage> {
    const userName = context.userName ? `, ${context.userName}` : '';
    const timeGreeting = this.getTimeBasedGreeting();
    
    return {
      message: `${timeGreeting}${userName}! 👋 Sou o assistente inteligente da Ars Machina Consultancy. \n\nEstou aqui para ajudar você com:\n• Informações sobre nossos serviços\n• Orçamentos personalizados\n• Agendamento de consultas\n• Dúvidas técnicas\n\nComo posso ajudar você hoje?`,
      type: 'quick_reply',
      metadata: {
        quickReplies: [
          { text: '💻 Desenvolvimento Web', payload: 'service_web', icon: '💻' },
          { text: '📱 Apps Mobile', payload: 'service_mobile', icon: '📱' },
          { text: '☁️ Cloud Computing', payload: 'service_cloud', icon: '☁️' },
          { text: '💰 Orçamento', payload: 'pricing', icon: '💰' }
        ]
      }
    };
  }

  private getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  private handleAdvancedServiceInquiry(message: string, context: ConversationContext): Partial<ChatMessage> {
    const serviceInterest = context.serviceInterest;
    
    if (serviceInterest && this.knowledgeBase.services[serviceInterest]) {
      const service = this.knowledgeBase.services[serviceInterest];
      
      return {
        message: `🎯 **${service.description}**\n\n` +
                `**Tecnologias:** ${service.technologies.join(', ')}\n\n` +
                `**Projetos recentes:**\n${service.projects.map(p => `• ${p}`).join('\n')}\n\n` +
                `**Investimento:** ${service.pricing}\n` +
                `**Prazo típico:** ${service.timeline}\n\n` +
                `Gostaria de saber mais detalhes ou tem algum projeto específico em mente?`,
        type: 'quick_reply',
        metadata: {
          quickReplies: [
            { text: '💰 Ver orçamento', payload: 'pricing_' + serviceInterest, icon: '💰' },
            { text: '📅 Agendar reunião', payload: 'schedule_meeting', icon: '📅' },
            { text: '📋 Mais detalhes', payload: 'more_details_' + serviceInterest, icon: '📋' },
            { text: '💬 Falar com especialista', payload: 'contact_specialist', icon: '💬' }
          ]
        }
      };
    }

    return {
      message: `🏗️ **Nossos Serviços Principais:**\n\n` +
              `💻 **Desenvolvimento Web & Mobile**\n` +
              `☁️ **Consultoria em Nuvem (AWS, Azure, GCP)**\n` +
              `🔒 **Segurança da Informação**\n` +
              `🤖 **Soluções de IA & Automação**\n` +
              `💼 **Consultoria Técnica & Mentoria**\n\n` +
              `Qual área te interessa mais?`,
      type: 'carousel',
      metadata: {
        carousel: [
          {
            title: 'Desenvolvimento Web',
            subtitle: 'Sites e aplicações modernas',
            buttons: [
              { text: 'Saiba mais', payload: 'service_web' },
              { text: 'Ver projetos', payload: 'projects_web' }
            ]
          },
          {
            title: 'Apps Mobile',
            subtitle: 'iOS e Android nativos',
            buttons: [
              { text: 'Saiba mais', payload: 'service_mobile' },
              { text: 'Ver projetos', payload: 'projects_mobile' }
            ]
          },
          {
            title: 'Cloud Computing',
            subtitle: 'AWS, Azure, Google Cloud',
            buttons: [
              { text: 'Saiba mais', payload: 'service_cloud' },
              { text: 'Migração', payload: 'cloud_migration' }
            ]
          }
        ]
      }
    };
  }

  private handleAdvancedPricing(message: string, context: ConversationContext): Partial<ChatMessage> {
    const serviceInterest = context.serviceInterest;
    
    if (serviceInterest && this.knowledgeBase.services[serviceInterest]) {
      const service = this.knowledgeBase.services[serviceInterest];
      
      return {
        message: `💰 **Investimento para ${service.description}:**\n\n` +
                `**Valor base:** ${service.pricing}\n` +
                `**Prazo:** ${service.timeline}\n\n` +
                `✅ **Incluído no orçamento:**\n` +
                `• Análise detalhada dos requisitos\n` +
                `• Desenvolvimento completo\n` +
                `• Testes e homologação\n` +
                `• 3 meses de suporte gratuito\n` +
                `• Documentação técnica\n\n` +
                `Para um orçamento personalizado, preciso conhecer melhor seu projeto. Podemos agendar uma conversa?`,
        type: 'quick_reply',
        metadata: {
          quickReplies: [
            { text: '📅 Agendar consulta gratuita', payload: 'schedule_consultation', icon: '📅' },
            { text: '📋 Enviar briefing', payload: 'send_brief', icon: '📋' },
            { text: '💬 WhatsApp', payload: 'contact_whatsapp', icon: '💬' },
            { text: '📧 Email', payload: 'contact_email', icon: '📧' }
          ]
        }
      };
    }

    return {
      message: `💰 **Nossos preços são personalizados conforme o projeto:**\n\n` +
              `🎯 **Desenvolvimento Web:** A partir de R$ 5.000\n` +
              `📱 **Apps Mobile:** A partir de R$ 8.000\n` +
              `☁️ **Cloud Computing:** A partir de R$ 3.000\n` +
              `🔒 **Cibersegurança:** A partir de R$ 4.000\n` +
              `🤖 **IA & Automação:** A partir de R$ 10.000\n` +
              `💼 **Consultoria:** A partir de R$ 2.000\n\n` +
              `✅ **Sempre incluído:**\n` +
              `• Avaliação gratuita inicial\n` +
              `• Orçamento detalhado sem compromisso\n` +
              `• Suporte pós-entrega\n` +
              `• Garantia de qualidade\n\n` +
              `Qual serviço te interessa para um orçamento personalizado?`,
      type: 'quick_reply',
      metadata: {
        quickReplies: [
          { text: '💻 Web', payload: 'pricing_web', icon: '💻' },
          { text: '📱 Mobile', payload: 'pricing_mobile', icon: '📱' },
          { text: '☁️ Cloud', payload: 'pricing_cloud', icon: '☁️' },
          { text: '📞 Falar com consultor', payload: 'contact_consultant', icon: '📞' }
        ]
      }
    };
  }

  private handleTimelineInquiry(message: string, context: ConversationContext): Partial<ChatMessage> {
    return {
      message: `⏰ **Prazos típicos dos nossos projetos:**\n\n` +
              `🚀 **Projetos Simples (1-3 meses):**\n` +
              `• Landing pages\n` +
              `• Sites institucionais\n` +
              `• Consultoria básica\n\n` +
              `⚡ **Projetos Médios (3-6 meses):**\n` +
              `• E-commerce completo\n` +
              `• Apps mobile básicos\n` +
              `• Sistemas de gestão\n\n` +
              `🎯 **Projetos Complexos (6-12 meses):**\n` +
              `• Plataformas enterprise\n` +
              `• Soluções de IA\n` +
              `• Transformação digital completa\n\n` +
              `O prazo final depende da complexidade e escopo. Quer que eu avalie seu projeto específico?`,
      type: 'quick_reply',
      metadata: {
        quickReplies: [
          { text: '📋 Avaliar meu projeto', payload: 'evaluate_project', icon: '📋' },
          { text: '⚡ Projeto urgente', payload: 'urgent_project', icon: '⚡' },
          { text: '📅 Agendar reunião', payload: 'schedule_meeting', icon: '📅' }
        ]
      }
    };
  }

  private handleAdvancedContact(context: ConversationContext): Partial<ChatMessage> {
    const urgencyText = context.urgency === 'high' ? '\n\n⚡ **Vejo que é urgente! Recomendo contato direto via WhatsApp para resposta mais rápida.**' : '';
    
    return {
      message: `📞 **Entre em contato conosco:**\n\n` +
              `📱 **WhatsApp:** +55 98 99964-9215\n` +
              `📧 **Email:** contato@arsmachinaconsultancy.com\n` +
              `🌐 **Site:** www.arsmachinaconsultancy.com\n` +
              `📍 **Localização:** São Luís, Maranhão\n\n` +
              `🕒 **Horário de atendimento:**\n` +
              `• Segunda a Sexta: 9h às 18h\n` +
              `• Sábado: 9h às 12h\n` +
              `• WhatsApp: 24h (resposta em até 2h)${urgencyText}`,
      type: 'quick_reply',
      metadata: {
        quickReplies: [
          { text: '💬 Abrir WhatsApp', payload: 'open_whatsapp', icon: '💬' },
          { text: '📧 Enviar email', payload: 'send_email', icon: '📧' },
          { text: '📅 Agendar reunião', payload: 'schedule_meeting', icon: '📅' },
          { text: '🏠 Ver localização', payload: 'view_location', icon: '🏠' }
        ]
      }
    };
  }

  private handleFAQ(message: string): Partial<ChatMessage> {
    const lowerMessage = message.toLowerCase();
    
    // Find matching FAQ
    const matchingFaq = this.knowledgeBase.faqs.find(faq =>
      faq.keywords.some(keyword => lowerMessage.includes(keyword))
    );

    if (matchingFaq) {
      return {
        message: `❓ **${matchingFaq.question}**\n\n${matchingFaq.answer}\n\nTem mais alguma dúvida?`,
        type: 'quick_reply',
        metadata: {
          quickReplies: [
            { text: '💰 Preços', payload: 'pricing', icon: '💰' },
            { text: '⏰ Prazos', payload: 'timeline', icon: '⏰' },
            { text: '🛠️ Tecnologias', payload: 'technologies', icon: '🛠️' },
            { text: '📞 Contato', payload: 'contact', icon: '📞' }
          ]
        }
      };
    }

    // Return general FAQ if no specific match
    return {
      message: `❓ **Perguntas Frequentes:**\n\n` +
              `• Quanto tempo leva um projeto?\n` +
              `• Vocês oferecem suporte?\n` +
              `• Como funciona o processo?\n` +
              `• Que tecnologias usam?\n\n` +
              `Qual dessas dúvidas posso esclarecer?`,
      type: 'quick_reply',
      metadata: {
        quickReplies: [
          { text: '⏰ Prazos', payload: 'faq_timeline', icon: '⏰' },
          { text: '🛠️ Suporte', payload: 'faq_support', icon: '🛠️' },
          { text: '📋 Processo', payload: 'faq_process', icon: '📋' },
          { text: '💻 Tecnologias', payload: 'faq_tech', icon: '💻' }
        ]
      }
    };
  }

  private handleProjectDetails(message: string, context: ConversationContext): Partial<ChatMessage> {
    return {
      message: `🚀 **Vamos falar sobre seu projeto!**\n\n` +
              `Para criar a melhor solução, preciso entender:\n\n` +
              `• Qual o objetivo principal?\n` +
              `• Quem é seu público-alvo?\n` +
              `• Que funcionalidades são essenciais?\n` +
              `• Há algum prazo específico?\n` +
              `• Qual seu orçamento estimado?\n\n` +
              `Podemos conversar sobre esses detalhes?`,
      type: 'quick_reply',
      metadata: {
        quickReplies: [
          { text: '📋 Enviar briefing', payload: 'send_brief', icon: '📋' },
          { text: '📞 Ligar agora', payload: 'call_now', icon: '📞' },
          { text: '📅 Agendar reunião', payload: 'schedule_meeting', icon: '📅' },
          { text: '💬 WhatsApp', payload: 'whatsapp_project', icon: '💬' }
        ]
      }
    };
  }

  private handleQualification(message: string, context: ConversationContext): Partial<ChatMessage> {
    const company = this.knowledgeBase.companyInfo;
    
    return {
      message: `🏢 **Sobre a ${company.name}:**\n\n` +
              `📅 **Fundada em:** ${company.founded}\n` +
              `📍 **Localização:** ${company.location}\n` +
              `👥 **Equipe:** ${company.team}\n` +
              `🎯 **Projetos:** ${company.projects}\n\n` +
              `🌟 **Nossas especialidades:**\n` +
              `${company.specialties.map((spec: string) => `• ${spec}`).join('\n')}\n\n` +
              `Somos uma consultoria jovem e inovadora, focada em entregar resultados excepcionais!`,
      type: 'quick_reply',
      metadata: {
        quickReplies: [
          { text: '👥 Conhecer equipe', payload: 'meet_team', icon: '👥' },
          { text: '🏆 Ver projetos', payload: 'view_projects', icon: '🏆' },
          { text: '📜 Certificações', payload: 'certifications', icon: '📜' },
          { text: '💼 Começar projeto', payload: 'start_project', icon: '💼' }
        ]
      }
    };
  }

  private handleIntelligentDefault(message: string, context: ConversationContext): Partial<ChatMessage> {
    const sentiment = this.analyzeSentiment(message);
    const responses = this.getContextualResponses(sentiment, context);
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      message: randomResponse.message,
      type: 'quick_reply',
      metadata: {
        quickReplies: randomResponse.quickReplies
      }
    };
  }

  private getContextualResponses(sentiment: 'positive' | 'negative' | 'neutral', context: ConversationContext) {
    const baseResponses = {
      positive: [
        {
          message: `😊 Fico feliz em ajudar! Para te dar a melhor orientação, me conte mais sobre o que você precisa. Sou especialista em soluções tecnológicas.`,
          quickReplies: [
            { text: '💻 Desenvolvimento', payload: 'service_web', icon: '💻' },
            { text: '📱 Apps', payload: 'service_mobile', icon: '📱' },
            { text: '☁️ Cloud', payload: 'service_cloud', icon: '☁️' },
            { text: '💰 Orçamento', payload: 'pricing', icon: '💰' }
          ]
        }
      ],
      negative: [
        {
          message: `😔 Entendo sua preocupação. Estou aqui para ajudar a resolver qualquer desafio tecnológico. Vamos conversar sobre como posso te auxiliar?`,
          quickReplies: [
            { text: '🆘 Preciso de ajuda', payload: 'need_help', icon: '🆘' },
            { text: '🔧 Resolver problema', payload: 'solve_problem', icon: '🔧' },
            { text: '📞 Falar com especialista', payload: 'contact_specialist', icon: '📞' },
            { text: '💬 WhatsApp urgente', payload: 'urgent_whatsapp', icon: '💬' }
          ]
        }
      ],
      neutral: [
        {
          message: `🤔 Para te ajudar melhor, me conte sobre o que você está procurando. Posso esclarecer dúvidas sobre nossos serviços ou ajudar com seu projeto.`,
          quickReplies: [
            { text: '🏗️ Nossos serviços', payload: 'services_overview', icon: '🏗️' },
            { text: '💡 Tenho uma ideia', payload: 'have_idea', icon: '💡' },
            { text: '❓ Tirar dúvidas', payload: 'ask_questions', icon: '❓' },
            { text: '📞 Falar conosco', payload: 'contact', icon: '📞' }
          ]
        }
      ]
    };

    return baseResponses[sentiment];
  }

  // Utility methods
  clearConversation(): void {
    this.conversationHistory.next([]);
    this.context.next({
      sessionId: this.generateSessionId(),
      conversationStage: 'greeting',
      leadScore: 0,
      preferences: {
        language: 'pt',
        communicationStyle: 'casual',
        responseLength: 'detailed'
      }
    });
    this.initializeSession();
  }

  exportConversation(): string {
    const history = this.conversationHistory.value;
    const context = this.context.value;
    
    return JSON.stringify({
      sessionId: context.sessionId,
      timestamp: new Date(),
      messages: history,
      context: context
    }, null, 2);
  }

  getConversationSummary(): any {
    const context = this.context.value;
    const history = this.conversationHistory.value;
    
    return {
      sessionId: context.sessionId,
      messageCount: history.length,
      userMessages: history.filter(m => m.sender === 'user').length,
      botMessages: history.filter(m => m.sender === 'bot').length,
      serviceInterest: context.serviceInterest,
      leadScore: context.leadScore,
      conversationStage: context.conversationStage,
      duration: context.lastActivity ? 
        new Date().getTime() - new Date(context.lastActivity).getTime() : 0
    };
  }
}
