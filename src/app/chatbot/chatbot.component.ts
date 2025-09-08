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

  private knowledgeBase = {
    services: {
      web: ['desenvolvimento web', 'sites', 'aplicações web', 'e-commerce', 'landing pages'],
      mobile: ['apps mobile', 'aplicativos', 'ios', 'android', 'react native', 'flutter'],
      cloud: ['aws', 'azure', 'google cloud', 'nuvem', 'infraestrutura', 'cloud computing'],
      security: ['segurança', 'cibersegurança', 'pentest', 'auditoria', 'compliance'],
      ai: ['inteligência artificial', 'machine learning', 'ia', 'automação', 'chatbots'],
      consulting: ['consultoria', 'assessoria', 'mentoria', 'treinamento']
    }
  };

  private conversationPatterns = {
    questions: ['como', 'qual', 'quando', 'onde', 'quem', 'quanto', 'por que', 'o que'],
    requests: ['quero', 'preciso', 'gostaria', 'posso', 'tem como', 'é possível'],
    problems: ['problema', 'erro', 'dificuldade', 'não funciona', 'não consigo'],
    comparisons: ['melhor', 'comparado', 'diferença', 'versus', 'vs'],
    urgency: ['urgente', 'rápido', 'imediatamente', 'hoje', 'agora']
  };

  ngOnInit() {
    this.isMinimized = true;
    this.showInfoBalloon = true;
  }

  toggleChat() {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      this.showInfoBalloon = false;
      if (this.messages.length === 0) {
        this.addBotMessage("Olá! 👋 Eu sou o assistente inteligente da Ars Machina Consultancy. Como posso ajudar você hoje?");
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

    setTimeout(() => {
      const response = this.generateResponse(message);
      this.addBotMessage(response);
      this.isLoading = false;
    }, 1500);
  }

  generateResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase().trim();
    this.updateContext(msg);
    const intent = this.analyzeIntent(msg);

    switch (intent) {
      case 'greeting': return this.handleGreeting();
      case 'service_inquiry': return this.handleServiceInquiry(msg);
      case 'contact': return this.handleContactInquiry();
      case 'pricing': return this.handlePricingInquiry();
      case 'project': return this.handleProjectInquiry(msg);
      case 'technology': return this.handleTechnologyInquiry(msg);
      case 'company': return this.handleCompanyInquiry();
      default: return this.handleIntelligentDefault(msg);
    }
  }

  private analyzeIntent(message: string): string {
    if (this.isGreeting(message)) return 'greeting';
    if (this.containsKeywords(message, ['serviço', 'serviços', 'o que vocês fazem'])) return 'service_inquiry';
    if (this.containsKeywords(message, ['contato', 'telefone', 'email', 'whatsapp'])) return 'contact';
    if (this.containsKeywords(message, ['preço', 'custo', 'valor', 'orçamento'])) return 'pricing';
    if (this.containsKeywords(message, ['projeto', 'desenvolvimento'])) return 'project';
    if (this.containsKeywords(message, ['tecnologia', 'tech', 'stack'])) return 'technology';
    if (this.containsKeywords(message, ['empresa', 'ars machina', 'sobre'])) return 'company';
    return 'default';
  }

  private updateContext(message: string): void {
    for (const [category, keywords] of Object.entries(this.knowledgeBase.services)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        this.context.serviceInterest = category;
        break;
      }
    }
  }

  private isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'];
    return greetings.some(greeting => message.includes(greeting)) && message.length < 50;
  }

  private containsKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private handleGreeting(): string {
    return "Olá! 👋 Sou o assistente inteligente da Ars Machina. Como posso ajudar você hoje?";
  }

  private handleServiceInquiry(message: string): string {
    return "🏗️ Oferecemos serviços completos em TI:\n\n" +
           "💻 Desenvolvimento Web & Mobile\n" +
           "☁️ Consultoria em Nuvem (AWS, Azure, GCP)\n" +
           "🔒 Segurança da Informação\n" +
           "🤖 Soluções de IA & Automação\n" +
           "💼 Consultoria Técnica & Mentoria\n\n" +
           "Qual desses serviços te interessa mais?";
  }

  private handleContactInquiry(): string {
    return "📞 Você pode nos contatar:\n\n" +
           "📧 Email: contato@arsmachinaconsultancy.com\n" +
           "📱 WhatsApp: +55 98 99964-9215\n" +
           "🌐 Site: www.arsmachinaconsultancy.com\n\n" +
           "Horário: Seg-Sex 9h-18h, Sáb 9h-12h";
  }

  private handlePricingInquiry(): string {
    return "💰 Nossos preços são personalizados:\n\n" +
           "✅ Avaliação gratuita inicial\n" +
           "✅ Orçamento detalhado sem compromisso\n" +
           "✅ Pagamento flexível\n" +
           "✅ Suporte pós-entrega incluído\n\n" +
           "Posso agendar uma conversa gratuita?";
  }

  private handleProjectInquiry(message: string): string {
    return "🚀 Temos experiência em diversos projetos:\n\n" +
           "• Sistemas web enterprise\n" +
           "• Aplicativos móveis escaláveis\n" +
           "• Migrações para nuvem\n" +
           "• Soluções de e-commerce\n\n" +
           "Conte-me mais sobre seu projeto!";
  }

  private handleTechnologyInquiry(message: string): string {
    return "🛠️ Trabalhamos com tecnologias modernas:\n\n" +
           "🎯 Frontend: React, Angular, Vue.js\n" +
           "⚙️ Backend: Node.js, Python, Java\n" +
           "☁️ Cloud: AWS, Azure, Google Cloud\n" +
           "🤖 IA: TensorFlow, PyTorch, OpenAI\n\n" +
           "Qual tecnologia específica te interessa?";
  }

  private handleCompanyInquiry(): string {
    return "🏢 Sobre a Ars Machina Consultancy:\n\n" +
           "🎯 Especializada em soluções tecnológicas\n" +
           "🌟 Mais de 200 projetos entregues\n" +
           "👥 Equipe de 30+ especialistas\n" +
           "🌍 Atuação nacional e internacional\n" +
           "💡 Foco em inovação e resultados\n\n" +
           "Somos uma consultoria full-stack!";
  }

  private handleIntelligentDefault(message: string): string {
    const responses = [
      "🤔 Deixe-me entender melhor. Você está procurando desenvolvimento, consultoria, ou algo específico?",
      "💡 Para te ajudar melhor, me conte sobre o que você precisa. Sou especialista em soluções tecnológicas.",
      "🎯 Que tipo de desafio tecnológico você está enfrentando?",
      "🚀 Estou aqui para ajudar com qualquer questão de tecnologia. O que você tem em mente?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}