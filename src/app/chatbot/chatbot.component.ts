import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'bot';
  message: string;
  timestamp?: Date;
}

interface ConversationContext {
  topic?: string;
  userName?: string;
  serviceInterest?: string;
  urgency?: 'low' | 'medium' | 'high';
  previousQuestions?: string[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  isMinimized: boolean = false;
  showInfoBalloon: boolean = false;
  context: ConversationContext = {};

  // Enhanced knowledge base for intelligent responses
  private knowledgeBase = {
    services: {
      web: ['desenvolvimento web', 'sites', 'aplicações web', 'e-commerce', 'landing pages', 'sistemas web', 'plataformas online'],
      mobile: ['apps mobile', 'aplicativos', 'ios', 'android', 'react native', 'flutter', 'aplicativos móveis'],
      cloud: ['aws', 'azure', 'google cloud', 'nuvem', 'infraestrutura', 'cloud computing', 'migração para nuvem'],
      security: ['segurança', 'cibersegurança', 'pentest', 'auditoria', 'compliance', 'segurança da informação'],
      ai: ['inteligência artificial', 'machine learning', 'ia', 'automação', 'chatbots', 'aprendizado de máquina'],
      consulting: ['consultoria', 'assessoria', 'mentoria', 'treinamento', 'consultoria técnica']
    },
    expertise: [
      '10+ anos de experiência',
      'Certificações AWS, Azure, Google Cloud',
      'Especialistas em DevOps e SRE',
      'Equipe multidisciplinar',
      'Projetos enterprise',
      'Metodologias ágeis',
      'Arquitetura de software'
    ],
    technologies: [
      'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', '.NET',
      'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Microservices',
      'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'
    ],
    industries: [
      'fintech', 'healthtech', 'e-commerce', 'educação', 'saúde', 'varejo',
      'logística', 'manufatura', 'telecomunicações', 'bancos'
    ],
    projectTypes: [
      'sistema de gestão', 'plataforma e-commerce', 'app delivery', 'sistema financeiro',
      'portal educacional', 'sistema de saúde', 'dashboard analítico', 'api rest'
    ]
  };

  // Conversation patterns for better intent recognition
  private conversationPatterns = {
    questions: ['como', 'qual', 'quando', 'onde', 'quem', 'quanto', 'por que', 'o que', 'pra que'],
    requests: ['quero', 'preciso', 'gostaria', 'posso', 'tem como', 'é possível'],
    problems: ['problema', 'erro', 'dificuldade', 'não funciona', 'não consigo'],
    comparisons: ['melhor', 'comparado', 'diferença', 'versus', 'vs'],
    urgency: ['urgente', 'rápido', 'imediatamente', 'hoje', 'agora']
  };

  ngOnInit() {
    // Do not open chat automatically on load
    // Instead, show a minimized chat with an info balloon
    this.isMinimized = true;
    this.showInfoBalloon = true;
  }

  toggleChat() {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      this.showInfoBalloon = false;
      if (this.messages.length === 0) {
        this.addBotMessage("Olá! 👋 Eu sou o assistente inteligente da Ars Machina Consultancy. Como posso ajudar você hoje? Posso informar sobre nossos serviços, agendar reuniões ou tirar dúvidas técnicas.");
      }
    }
  }

  addBotMessage(message: string) {
    this.messages.push({ sender: 'bot', message });
    this.scrollToBottom();
  }

  addUserMessage(message: string) {
    this.messages.push({ sender: 'user', message });
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const message = this.userInput.trim();
    this.addUserMessage(message);
    this.userInput = '';
    this.isLoading = true;

    // Simulate AI response with delay and simple logic
    setTimeout(() => {
      const response = this.generateResponse(message);
      this.addBotMessage(response);
      this.isLoading = false;
    }, 1500);
  }

  generateResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase().trim();

    // Update context with enhanced analysis
    this.updateContext(msg);

    // Analyze intent with better pattern recognition
    const intent = this.analyzeIntent(msg);

    switch (intent) {
      case 'greeting':
        return this.handleGreeting();

      case 'service_inquiry':
        return this.handleServiceInquiry(msg);

      case 'contact':
        return this.handleContactInquiry();

      case 'pricing':
        return this.handlePricingInquiry();

      case 'schedule':
        return this.handleScheduleInquiry();

      case 'project':
        return this.handleProjectInquiry(msg);

      case 'technology':
        return this.handleTechnologyInquiry(msg);

      case 'expertise':
        return this.handleExpertiseInquiry();

      case 'support':
        return this.handleSupportInquiry();

      case 'appointment':
        return this.handleAppointmentRequest();

      case 'company':
        return this.handleCompanyInquiry();

      case 'comparison':
        // Fix: method name corrected from handleComparisonInquiry to handleCompanyInquiry
        return this.handleCompanyInquiry();

      case 'problem':
        return this.handleProblemInquiry(msg);

      case 'follow_up':
        return this.handleFollowUpQuestion(msg);

      default:
        return this.handleIntelligentDefault(msg);
    }
  }

  private analyzeIntent(message: string): string {
    // Check for question patterns
    if (this.conversationPatterns.questions.some(q => message.includes(q))) {
      // Determine question type
      if (this.containsKeywords(message, ['serviço', 'service', 'serviços', 'services', 'o que vocês fazem'])) {
        return 'service_inquiry';
      }
      if (this.containsKeywords(message, ['tecnologia', 'tech', 'stack', 'framework', 'linguagem'])) {
        return 'technology';
      }
      if (this.containsKeywords(message, ['experiência', 'experience', 'expertise', 'qualificação', 'certificação'])) {
        return 'expertise';
      }
      if (this.containsKeywords(message, ['preço', 'price', 'custo', 'cost', 'valor', 'value', 'orçamento'])) {
        return 'pricing';
      }
      if (this.containsKeywords(message, ['horário', 'schedule', 'hora', 'time', 'quando', 'when', 'disponível'])) {
        return 'schedule';
      }
      if (this.containsKeywords(message, ['projeto', 'project', 'desenvolvimento', 'development'])) {
        return 'project';
      }
      if (this.containsKeywords(message, ['empresa', 'company', 'ars machina', 'sobre vocês', 'about'])) {
        return 'company';
      }
      if (this.conversationPatterns.comparisons.some(c => message.includes(c))) {
        return 'comparison';
      }
    }

    // Check for request patterns
    if (this.conversationPatterns.requests.some(r => message.includes(r))) {
      if (this.containsKeywords(message, ['contato', 'contact', 'telefone', 'phone', 'email', 'whatsapp'])) {
        return 'contact';
      }
      if (this.containsKeywords(message, ['reunião', 'meeting', 'agendar', 'schedule', 'consulta', 'consultation'])) {
        return 'appointment';
      }
      if (this.containsKeywords(message, ['ajuda', 'help', 'suporte', 'support'])) {
        return 'support';
      }
    }

    // Check for problem patterns
    if (this.conversationPatterns.problems.some(p => message.includes(p))) {
      return 'problem';
    }

    // Check for urgency
    if (this.conversationPatterns.urgency.some(u => message.includes(u))) {
      this.context.urgency = 'high';
    }

    // Check for greetings
    if (this.isGreeting(message)) {
      return 'greeting';
    }

    // Check for follow-up questions based on context
    if (this.context.topic && this.context.previousQuestions && this.context.previousQuestions.length > 1) {
      return 'follow_up';
    }

    // Default fallback
    return 'default';
  }

  private updateContext(message: string): void {
    // Extract potential service interests
    for (const [category, keywords] of Object.entries(this.knowledgeBase.services)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        this.context.serviceInterest = category;
        this.context.topic = category;
        break;
      }
    }

    // Detect urgency
    if (message.includes('urgente') || message.includes('urgent') || message.includes('rápido')) {
      this.context.urgency = 'high';
    } else if (message.includes('logo') || message.includes('breve') || message.includes('soon')) {
      this.context.urgency = 'medium';
    }

    // Track conversation history
    if (!this.context.previousQuestions) {
      this.context.previousQuestions = [];
    }
    this.context.previousQuestions.push(message);
    if (this.context.previousQuestions.length > 5) {
      this.context.previousQuestions.shift();
    }
  }

  private isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi', 'hey'];
    return greetings.some(greeting => message.includes(greeting)) && message.length < 50;
  }

  private containsKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private handleGreeting(): string {
    const responses = [
      "Olá! 👋 Sou o assistente inteligente da Ars Machina. Como posso ajudar você hoje?",
      "Oi! Bem-vindo à Ars Machina! Estou aqui para esclarecer suas dúvidas sobre nossos serviços.",
      "Olá! Que bom ter você aqui! Posso ajudar com informações sobre desenvolvimento, consultoria ou qualquer dúvida técnica."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private handleServiceInquiry(message: string): string {
    let response = "Oferecemos uma gama completa de serviços em TI:\n\n";

    if (this.context.serviceInterest) {
      const interest = this.context.serviceInterest;
      switch (interest) {
        case 'web':
          response += "🏗️ Desenvolvimento Web: Sites responsivos, e-commerce, aplicações web modernas\n";
          break;
        case 'mobile':
          response += "📱 Desenvolvimento Mobile: Apps iOS/Android nativos e híbridos\n";
          break;
        case 'cloud':
          response += "☁️ Cloud & Infraestrutura: Migração para nuvem, DevOps, SRE\n";
          break;
        case 'security':
          response += "🔒 Segurança Cibernética: Pentest, auditoria, compliance\n";
          break;
        case 'ai':
          response += "🤖 Inteligência Artificial: Machine Learning, automação, chatbots\n";
          break;
        case 'consulting':
          response += "💼 Consultoria: Assessoria técnica, mentoria, treinamentos\n";
          break;
      }
    } else {
      response += "🏗️ Desenvolvimento Web & Mobile\n";
      response += "☁️ Consultoria em Nuvem (AWS, Azure, GCP)\n";
      response += "🔒 Segurança da Informação\n";
      response += "🤖 Soluções de IA & Automação\n";
      response += "💼 Consultoria Técnica & Mentoria\n";
    }

    response += "\nQual desses serviços te interessa mais?";
    return response;
  }

  private handleContactInquiry(): string {
    return "📞 Você pode nos contatar por vários canais:\n\n" +
           "📧 Email: contato@arsmachinaconsultancy.com\n" +
           "📱 WhatsApp: +55 98 99964-9215\n" +
           "📞 Telefone: +55 98 99964-9215\n" +
           "🌐 Site: www.arsmachinaconsultancy.com\n\n" +
           "Horário: Seg-Sex 9h-18h, Sáb 9h-12h\n\n" +
           "Qual canal prefere usar?";
  }

  private handlePricingInquiry(): string {
    return "💰 Nossos preços são personalizados conforme cada projeto:\n\n" +
           "✅ Avaliação gratuita inicial\n" +
           "✅ Orçamento detalhado sem compromisso\n" +
           "✅ Pagamento flexível (boleto, cartão, PIX)\n" +
           "✅ Suporte pós-entrega incluído\n\n" +
           "Posso agendar uma conversa gratuita para entender melhor seu projeto e fornecer um orçamento preciso?";
  }

  private handleScheduleInquiry(): string {
    return "🕐 Nosso horário de atendimento:\n\n" +
           "📅 Segunda a Sexta: 9h às 18h\n" +
           "📅 Sábado: 9h às 12h\n" +
           "📅 Domingo: Fechado\n\n" +
           "⏰ Tempo de resposta: Até 2h em horário comercial\n" +
           "🚀 Projetos urgentes: Suporte 24/7 disponível\n\n" +
           "Precisa de atendimento fora do horário comercial?";
  }

  private handleProjectInquiry(message: string): string {
    const responses = [
      "🚀 Temos experiência em diversos tipos de projetos:\n\n" +
      "• Sistemas web enterprise\n" +
      "• Aplicativos móveis escaláveis\n" +
      "• Migrações para nuvem\n" +
      "• Soluções de e-commerce\n" +
      "• Plataformas de análise de dados\n\n" +
      "Conte-me mais sobre seu projeto! Que tipo de solução você precisa?",

      "💡 Cada projeto é único! Podemos ajudar com:\n\n" +
      "🏗️ Arquitetura e planejamento\n" +
      "⚡ Desenvolvimento ágil\n" +
      "🧪 Testes e qualidade\n" +
      "🚀 Deploy e monitoramento\n" +
      "📚 Documentação completa\n\n" +
      "Qual é o objetivo principal do seu projeto?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private handleTechnologyInquiry(message: string): string {
    return "🛠️ Trabalhamos com as tecnologias mais modernas:\n\n" +
           "🎯 Frontend: React, Angular, Vue.js, TypeScript\n" +
           "⚙️ Backend: Node.js, Python, Java, .NET\n" +
           "☁️ Cloud: AWS, Azure, Google Cloud\n" +
           "🐳 Containers: Docker, Kubernetes\n" +
           "🔄 DevOps: CI/CD, Terraform, Ansible\n" +
           "🤖 IA: TensorFlow, PyTorch, OpenAI\n\n" +
           "Qual tecnologia específica você gostaria de saber mais?";
  }

  private handleExpertiseInquiry(): string {
    return "🏆 Nossa expertise inclui:\n\n" +
           "📈 10+ anos de experiência no mercado\n" +
           "🎓 Certificações AWS, Azure, Google Cloud\n" +
           "👥 Equipe multidisciplinar (30+ profissionais)\n" +
           "🏢 Projetos para empresas de todos os portes\n" +
           "🌟 Especialistas em DevOps e SRE\n" +
           "🎯 Metodologias ágeis certificadas\n\n" +
           "Quer conhecer nosso portfólio de cases de sucesso?";
  }

  private handleSupportInquiry(): string {
    return "🆘 Como posso ajudar você?\n\n" +
           "🔧 Problemas técnicos: Diagnóstico e solução\n" +
           "📚 Consultoria: Orientações sobre melhores práticas\n" +
           "🎯 Projetos: Planejamento e execução\n" +
           "💡 Inovação: Ideias para otimizar processos\n" +
           "📞 Suporte: Acompanhamento pós-entrega\n\n" +
           "Descreva seu desafio específico para eu poder ajudar melhor!";
  }

  private handleAppointmentRequest(): string {
    return "📅 Vamos agendar uma reunião!\n\n" +
           "✅ Consultoria inicial gratuita (30min)\n" +
           "✅ Avaliação técnica detalhada\n" +
           "✅ Proposta comercial personalizada\n" +
           "✅ Cronograma e próximos passos\n\n" +
           "Qual seria o melhor dia e horário para você?\n" +
           "Também posso enviar um link para agendamento online.";
  }

  private handleCompanyInquiry(): string {
    return "🏢 Sobre a Ars Machina Consultancy:\n\n" +
           "🎯 Especializada em soluções tecnológicas\n" +
           "🌟 Mais de 200 projetos entregues\n" +
           "👥 Equipe de 30+ especialistas\n" +
           "🌍 Atuação nacional e internacional\n" +
           "💡 Foco em inovação e resultados\n" +
           "🤝 Parcerias com grandes empresas\n\n" +
           "Somos uma consultoria full-stack, desde estratégia até implementação!";
  }



  private handleProblemInquiry(message: string): string {
    const problemResponses = [
      "🚨 Entendi que você está enfrentando um problema. Vamos resolver isso juntos!",
      "🔧 Problemas técnicos são nossa especialidade! Descreva o que está acontecendo.",
      "🆘 Não se preocupe, estamos aqui para ajudar. Qual é o desafio que você está enfrentando?"
    ];

    let response = problemResponses[Math.floor(Math.random() * problemResponses.length)] + "\n\n";

    // Analyze problem type
    if (message.includes('performance') || message.includes('lento') || message.includes('slow')) {
      response += "⚡ Para problemas de performance, podemos ajudar com:\n" +
                  "• Otimização de código e queries\n" +
                  "• Arquitetura de cache\n" +
                  "• Otimização de banco de dados\n" +
                  "• CDN e balanceamento de carga\n\n";
    }

    if (message.includes('segurança') || message.includes('security') || message.includes('hack')) {
      response += "🔒 Para questões de segurança, oferecemos:\n" +
                  "• Auditoria de vulnerabilidades\n" +
                  "• Implementação de melhores práticas\n" +
                  "• Testes de penetração\n" +
                  "• Compliance com regulamentações\n\n";
    }

    if (message.includes('deploy') || message.includes('implantação') || message.includes('erro')) {
      response += "🚀 Para problemas de deploy, podemos ajudar com:\n" +
                  "• Configuração de CI/CD\n" +
                  "• Automação de processos\n" +
                  "• Monitoramento e logs\n" +
                  "• Rollback strategies\n\n";
    }

    response += "Descreva o problema em detalhes para eu poder te ajudar melhor!";
    return response;
  }

  private handleFollowUpQuestion(message: string): string {
    if (!this.context.topic || !this.context.previousQuestions) {
      return this.handleIntelligentDefault(message);
    }

    const lastQuestion = this.context.previousQuestions[this.context.previousQuestions.length - 2];

    // Provide contextual follow-up based on previous conversation
    if (lastQuestion.includes('preço') || lastQuestion.includes('custo')) {
      return "💰 Seguindo nossa conversa sobre preços, posso agendar uma reunião gratuita para discutir seu projeto específico e fornecer um orçamento personalizado?";
    }

    if (lastQuestion.includes('tecnologia') || lastQuestion.includes('stack')) {
      return "🛠️ Sobre as tecnologias que mencionamos, qual delas te interessou mais? Posso dar mais detalhes sobre implementação e benefícios.";
    }

    if (lastQuestion.includes('projeto') || lastQuestion.includes('desenvolvimento')) {
      return "🚀 Continuando sobre seu projeto, que prazo você tem em mente? Podemos adaptar nossa metodologia ágil para atender suas necessidades.";
    }

    return `Sobre nossa conversa anterior sobre ${this.context.topic}, o que mais você gostaria de saber?`;
  }

  private handleIntelligentDefault(message: string): string {
    // Enhanced default responses with better context awareness
    const intelligentResponses = [
      {
        condition: () => this.context.topic,
        response: `Sobre ${this.context.topic}, posso te ajudar com mais detalhes. O que especificamente você gostaria de saber?`
      },
      {
        condition: () => this.context.urgency === 'high',
        response: "🚨 Vejo que é uma questão urgente! Podemos priorizar seu atendimento. Que tipo de ajuda você precisa imediatamente?"
      },
      {
        condition: () => this.context.serviceInterest,
        response: `Parece que você tem interesse em ${this.context.serviceInterest}. Posso fornecer informações mais específicas sobre esse serviço?`
      },
      {
        condition: () => this.knowledgeBase.industries.some(industry => message.includes(industry)),
        response: "📊 Vejo que trabalha com um setor específico. Temos experiência em diversos segmentos! Conte-me mais sobre seu negócio."
      },
      {
        condition: () => this.knowledgeBase.projectTypes.some(type => message.includes(type)),
        response: "🎯 Identifiquei o tipo de projeto que você mencionou. Temos cases similares muito bem-sucedidos! Quer conhecer alguns?"
      }
    ];

    // Check for matching conditions
    for (const item of intelligentResponses) {
      if (item.condition()) {
        return item.response;
      }
    }

    // Fallback responses with personality
    const fallbackResponses = [
      "🤔 Hmm, deixe-me entender melhor sua necessidade. Você está procurando por desenvolvimento de software, consultoria, ou algo mais específico?",
      "💡 Interessante! Para te ajudar melhor, me conte um pouco mais sobre o que você precisa. Sou especialista em soluções tecnológicas.",
      "🎯 Vamos encontrar a solução perfeita para você! Que tipo de desafio tecnológico você está enfrentando?",
      "🚀 Estou aqui para ajudar com qualquer questão relacionada a tecnologia e desenvolvimento. O que você tem em mente?"
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  private handleDefaultResponse(message: string): string {
    // Keep the old method for backward compatibility
    return this.handleIntelligentDefault(message);
  }
}
