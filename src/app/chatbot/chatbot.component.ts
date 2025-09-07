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
  context: ConversationContext = {};

  // Knowledge base for intelligent responses
  private knowledgeBase = {
    services: {
      web: ['desenvolvimento web', 'sites', 'aplicações web', 'e-commerce', 'landing pages'],
      mobile: ['apps mobile', 'aplicativos', 'ios', 'android', 'react native', 'flutter'],
      cloud: ['aws', 'azure', 'google cloud', 'nuvem', 'infraestrutura'],
      security: ['segurança', 'cibersegurança', 'pentest', 'auditoria', 'compliance'],
      ai: ['inteligência artificial', 'machine learning', 'ia', 'automação', 'chatbots'],
      consulting: ['consultoria', 'assessoria', 'mentoria', 'treinamento']
    },
    expertise: [
      '10+ anos de experiência',
      'Certificações AWS, Azure, Google Cloud',
      'Especialistas em DevOps e SRE',
      'Equipe multidisciplinar',
      'Projetos enterprise'
    ],
    technologies: [
      'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java',
      'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Microservices'
    ]
  };

  ngOnInit() {
    this.addBotMessage("Olá! 👋 Eu sou o assistente inteligente da Ars Machina Consultancy. Como posso ajudar você hoje? Posso informar sobre nossos serviços, agendar reuniões ou tirar dúvidas técnicas.");
  }

  toggleChat() {
    this.isMinimized = !this.isMinimized;
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

    // Update context
    this.updateContext(msg);

    // Greeting responses
    if (this.isGreeting(msg)) {
      return this.handleGreeting();
    }

    // Service inquiries
    if (this.containsKeywords(msg, ['serviço', 'service', 'serviços', 'services', 'o que vocês fazem'])) {
      return this.handleServiceInquiry(msg);
    }

    // Contact information
    if (this.containsKeywords(msg, ['contato', 'contact', 'telefone', 'phone', 'email', 'whatsapp'])) {
      return this.handleContactInquiry();
    }

    // Pricing inquiries
    if (this.containsKeywords(msg, ['preço', 'price', 'custo', 'cost', 'valor', 'value', 'orçamento'])) {
      return this.handlePricingInquiry();
    }

    // Schedule/Time inquiries
    if (this.containsKeywords(msg, ['horário', 'schedule', 'hora', 'time', 'quando', 'when', 'disponível'])) {
      return this.handleScheduleInquiry();
    }

    // Project inquiries
    if (this.containsKeywords(msg, ['projeto', 'project', 'desenvolvimento', 'development'])) {
      return this.handleProjectInquiry(msg);
    }

    // Technology specific inquiries
    if (this.containsKeywords(msg, ['tecnologia', 'tech', 'stack', 'framework', 'linguagem'])) {
      return this.handleTechnologyInquiry(msg);
    }

    // Experience/Expertise inquiries
    if (this.containsKeywords(msg, ['experiência', 'experience', 'expertise', 'qualificação', 'certificação'])) {
      return this.handleExpertiseInquiry();
    }

    // Support/Help inquiries
    if (this.containsKeywords(msg, ['ajuda', 'help', 'suporte', 'support', 'problema', 'issue'])) {
      return this.handleSupportInquiry();
    }

    // Appointment/Meeting requests
    if (this.containsKeywords(msg, ['reunião', 'meeting', 'agendar', 'schedule', 'consulta', 'consultation'])) {
      return this.handleAppointmentRequest();
    }

    // Company information
    if (this.containsKeywords(msg, ['empresa', 'company', 'ars machina', 'sobre vocês', 'about'])) {
      return this.handleCompanyInquiry();
    }

    // Default response with context awareness
    return this.handleDefaultResponse(msg);
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

  private handleDefaultResponse(message: string): string {
    const responses = [
      "Hmm, não entendi completamente. Poderia ser mais específico sobre o que você precisa? Posso ajudar com desenvolvimento, consultoria, segurança, ou qualquer questão técnica.",
      "Desculpe, não consegui captar exatamente o que você quis dizer. Tente reformular a pergunta ou me diga qual área você gostaria de explorar: serviços, tecnologias, preços, ou agendamento?",
      "Interessante! Para te ajudar melhor, me conte mais detalhes. Estou preparado para falar sobre nossos serviços de desenvolvimento, consultoria em nuvem, segurança cibernética, ou soluções de IA."
    ];

    // If we have context, provide more targeted response
    if (this.context.topic) {
      return `Sobre ${this.context.topic}, posso te dar mais detalhes. O que especificamente você gostaria de saber?`;
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }
}
