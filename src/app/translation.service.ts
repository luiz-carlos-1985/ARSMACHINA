import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<string>('pt');
  public currentLanguage$ = this.currentLanguage.asObservable();

  private translations: { [key: string]: { [key: string]: string } } = {
    pt: {
      // Navigation
      'nav.home': 'Início',
      'nav.about': 'Sobre',
      'nav.services': 'Serviços',
      'nav.blog': 'Blog',
      'nav.contact': 'Contato',
      'nav.login': 'Entrar',
      'nav.logout': 'Sair',
      'nav.dashboard': 'Painel',
      'nav.language': 'Idioma',

      // Landing page
      'hero.title': 'Ars Machina Consultancy',
      'hero.subtitle': 'Transformando ideias em realidade digital',
      'hero.description': 'Somos especialistas em desenvolvimento de software, consultoria tecnológica e soluções inovadoras para impulsionar seu negócio.',
      'hero.cta': 'Entre em Contato',

      // Login
      'login.title': 'Entrar',
      'login.email': 'E-mail',
      'login.password': 'Senha',
      'login.submit': 'Entrar',
      'login.error': 'Credenciais inválidas',
      'login.fillFields': 'Por favor, preencha todos os campos.',
      'login.noAccount': 'Não tem uma conta?',
      'login.register': 'Registre-se',
      'login.forgotPassword': 'Esqueceu a senha?',

      // Register
      'register.title': 'Criar Conta',
      'register.email': 'E-mail',
      'register.password': 'Senha',
      'register.confirmPassword': 'Confirmar Senha',
      'register.invalid': 'inválido',
      'register.passwordTooShort': 'deve ter no mínimo 6 caracteres',
      'register.confirmPasswordRequired': 'Confirmação de senha é obrigatória',
      'register.creating': 'Criando conta',
      'register.createAccount': 'Criar Conta',
      'register.haveAccount': 'Já tem uma conta?',
      'register.login': 'Entrar',
      'register.fillFields': 'Por favor, preencha todos os campos.',
      'register.passwordMismatch': 'As senhas não coincidem.',
      'register.error': 'Erro ao criar conta. Tente novamente.',
      'register.success': 'Conta criada com sucesso! Redirecionando para o login...',
      'register.confirmationRequired': 'Conta criada! Verifique seu e-mail para confirmar a conta.',
      'register.userExists': 'Este e-mail já está cadastrado.',
      'register.invalidPassword': 'A senha não atende aos requisitos mínimos.',
      'register.invalidParameter': 'Parâmetros inválidos. Verifique os dados informados.',

      // Password Recovery
      'resetPassword.title': 'Recuperar Senha',
      'resetPassword.instructions': 'Digite seu e-mail para receber instruções de recuperação de senha.',
      'resetPassword.emailLabel': 'E-mail',
      'resetPassword.sendEmail': 'Enviar E-mail',
      'resetPassword.sending': 'Enviando...',
      'resetPassword.emailSent': 'E-mail enviado com sucesso! Verifique sua caixa de entrada e também a pasta de spam.',
      'resetPassword.enterEmail': 'Ops! Precisamos do seu e-mail para enviar as instruções de recuperação.',
      'resetPassword.error': 'Não conseguimos enviar o e-mail. Verifique se o endereço está correto e tente novamente.',
      'resetPassword.confirmInstructions': 'Digite o código enviado para seu e-mail e sua nova senha.',
      'resetPassword.codeLabel': 'Código de Verificação',
      'resetPassword.newPasswordLabel': 'Nova Senha',
      'resetPassword.confirmPasswordLabel': 'Confirmar Nova Senha',
      'resetPassword.fillAllFields': 'Por favor, preencha todos os campos para continuar.',
      'resetPassword.passwordMismatch': 'As senhas não coincidem. Digite a mesma senha nos dois campos.',
      'resetPassword.resetPassword': 'Redefinir Senha',
      'resetPassword.resetting': 'Redefinindo...',
      'resetPassword.success': 'Senha redefinida com sucesso! Você será redirecionado para o login em instantes.',
      'resetPassword.backToLogin': 'Voltar ao Login',

      // Email Verification
      'emailVerification.title': 'Verificar E-mail',
      'emailVerification.instructions': 'Digite o código de verificação enviado para seu e-mail.',
      'emailVerification.emailLabel': 'E-mail',
      'emailVerification.codeLabel': 'Código de Verificação',
      'emailVerification.verifyEmail': 'Verificar E-mail',
      'emailVerification.verifying': 'Verificando...',
      'emailVerification.fillFields': 'Por favor, preencha todos os campos.',
      'emailVerification.enterEmail': 'Por favor, digite seu e-mail.',
      'emailVerification.codeSent': 'Código reenviado! Verifique seu e-mail.',
      'emailVerification.resendCode': 'Reenviar Código',
      'emailVerification.success': 'E-mail verificado com sucesso! Bem-vindo!',
      'emailVerification.error': 'Erro ao verificar e-mail. Tente novamente.',
      'emailVerification.invalidCode': 'Código inválido. Verifique e tente novamente.',
      'emailVerification.expiredCode': 'Código expirado. Solicite um novo código.',
      'emailVerification.notAuthorized': 'Não autorizado. Verifique suas credenciais.',
      'emailVerification.noCode': 'Não recebeu o código?',
      'emailVerification.backToLogin': 'Voltar ao Login',

      // Dashboard
      'dashboard.welcome': 'Bem-vindo ao seu painel',
      'dashboard.loggedIn': 'Você está logado com sucesso!',
      'dashboard.profileInfo': 'Informações do Perfil',
      'dashboard.manageAccount': 'Gerencie suas configurações de conta e preferências.',
      'dashboard.editProfile': 'Editar Perfil',
      'dashboard.recentActivity': 'Atividade Recente',
      'dashboard.viewUpdates': 'Veja suas interações e atualizações recentes.',
      'dashboard.viewActivity': 'Ver Atividade',
      'dashboard.settings': 'Configurações',
      'dashboard.configurePreferences': 'Configure suas preferências do aplicativo.',
      'dashboard.openSettings': 'Abrir Configurações',
      'dashboard.logout': 'Sair',
      'dashboard.quickActions': 'Ações Rápidas',
      'dashboard.newProject': 'Novo Projeto',
      'dashboard.newTask': 'Nova Tarefa',
      'dashboard.scheduleMeeting': 'Agendar Reunião',
      'dashboard.generateReport': 'Gerar Relatório',
      'dashboard.analytics': 'Análises',
      'dashboard.productivity': 'Produtividade',
      'dashboard.teamPerformance': 'Performance da Equipe',
      'dashboard.clientSatisfaction': 'Satisfação do Cliente',
      'dashboard.revenue': 'Receita',
      'dashboard.fromLastMonth': 'desde o mês passado',
      'dashboard.projectProgress': 'Progresso dos Projetos',
      'dashboard.due': 'Prazo',
      'dashboard.members': 'membros',
      'dashboard.notifications': 'Notificações',
      'dashboard.dismissNotification': 'Dispensar notificação',
      'dashboard.markAsRead': 'Marcar como lida',
      'dashboard.viewAll': 'Ver Todas',
      'dashboard.quickLinks': 'Links Rápidos',
      'dashboard.profile': 'Perfil',
      'dashboard.reports': 'Relatórios',
      'dashboard.help': 'Ajuda',
      'dashboard.projects': 'Projetos',
      'dashboard.tasks': 'Tarefas',
      'dashboard.completed': 'Concluídas',

      // About Section
      'about.title': 'Sobre Nós',
      'about.description': 'Ars Machina Consultancy é uma empresa emergente em consultoria em TI, apaixonada por transformar ideias em soluções digitais inovadoras. Nossa equipe jovem e dinâmica combina conhecimento técnico atualizado com criatividade e dedicação para ajudar empresas a se adaptarem ao mundo digital. Estamos com muito entusiasmo e comprometimento em entregar resultados excepcionais aos nossos clientes.',
      'about.projects': 'Projetos Concluídos',
      'about.clients': 'Clientes Atendidos',
      'about.experience': 'Ano de Experiência',

      // Services Section
      'services.title': 'Nossos Serviços',
      'services.software.title': 'Desenvolvimento de Software',
      'services.software.description': 'Criamos aplicações web e móveis personalizadas, utilizando as tecnologias mais modernas do mercado.',
      'services.cloud.title': 'Cloud Computing',
      'services.cloud.description': 'Migração e otimização de infraestrutura em nuvem, garantindo escalabilidade e eficiência.',
      'services.security.title': 'Cibersegurança',
      'services.security.description': 'Proteção completa dos seus dados e sistemas contra ameaças digitais.',
      'services.analytics.title': 'Análise de Dados',
      'services.analytics.description': 'Transformamos dados em insights valiosos para tomada de decisões estratégicas.',
      'services.ai.title': 'Inteligência Artificial',
      'services.ai.description': 'Implementamos soluções de IA para automatizar processos e aumentar a produtividade.',
      'services.consulting.title': 'Consultoria Digital',
      'services.consulting.description': 'Orientação especializada para digitalização e modernização de processos empresariais.',

      // Blog Section
      'blog.title': 'Últimas Postagens',
      'blog.newPost': 'Nova Postagem',
      'blog.readMore': 'Leia mais sobre esta postagem fascinante...',

      // Contact Section
      'contact.title': 'Entre em Contato',
      'contact.description': 'Pronto para transformar seu negócio? Vamos conversar!',
      'contact.location': 'São Luís, Brasil',
      'contact.sendMessage': 'Envie uma mensagem',
      'contact.name': 'Nome',
      'contact.email': 'Email',
      'contact.message': 'Mensagem',
      'contact.send': 'Enviar',

      // About Section - Mission and Team
      'about.mission.title': 'Nossa Missão',
      'about.mission.description': 'Proporcionar soluções inovadoras em TI que impulsionam o crescimento e a eficiência dos nossos clientes, utilizando as melhores práticas e tecnologias de ponta.',
      'about.team.title': 'Nossa Equipe',
      'about.team.member1.name': 'Luiz Carlos',
      'about.team.member1.role': 'Arquiteto e Engenheiro de Software & Fundador',
      'about.team.member1.description': 'Especialista em arquitetura de sistemas e liderança de equipes de desenvolvimento.',

      // Services Section - Interactive
      'services.interactive.title': 'Por que escolher a Ars Machina Consultancy?',
      'services.interactive.description': 'Oferecemos soluções personalizadas que atendem às necessidades específicas do seu negócio, com foco em inovação e resultados mensuráveis.',
      'services.interactive.cta': 'Fale conosco',

      // Footer
      'footer.rights': 'Todos os direitos reservados.'
    },
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.blog': 'Blog',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'nav.logout': 'Logout',
      'nav.dashboard': 'Dashboard',
      'nav.language': 'Language',

      // Landing page
      'hero.title': 'Ars Machina Consultancy',
      'hero.subtitle': 'Transforming ideas into digital reality',
      'hero.description': 'We are experts in software development, technology consulting and innovative solutions to boost your business.',
      'hero.cta': 'Get in Touch',

      // Login
      'login.title': 'Login',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.submit': 'Login',
      'login.error': 'Invalid credentials',
      'login.fillFields': 'Please fill in all fields.',
      'login.noAccount': 'Don\'t have an account?',
      'login.register': 'Sign up',
      'login.forgotPassword': 'Forgot password?',

      // Register
      'register.title': 'Create Account',
      'register.email': 'Email',
      'register.password': 'Password',
      'register.confirmPassword': 'Confirm Password',
      'register.invalid': 'invalid',
      'register.passwordTooShort': 'must be at least 6 characters',
      'register.confirmPasswordRequired': 'Password confirmation is required',
      'register.creating': 'Creating account',
      'register.createAccount': 'Create Account',
      'register.haveAccount': 'Already have an account?',
      'register.login': 'Login',
      'register.fillFields': 'Please fill in all fields.',
      'register.passwordMismatch': 'Passwords do not match.',
      'register.error': 'Error creating account. Please try again.',
      'register.success': 'Account created successfully! Redirecting to login...',
      'register.confirmationRequired': 'Account created! Please check your email to confirm your account.',
      'register.userExists': 'This email is already registered.',
      'register.invalidPassword': 'Password does not meet minimum requirements.',
      'register.invalidParameter': 'Invalid parameters. Please check the information provided.',

      // Password Recovery
      'resetPassword.title': 'Reset Password',
      'resetPassword.instructions': 'Enter your email to receive password recovery instructions.',
      'resetPassword.emailLabel': 'Email',
      'resetPassword.sendEmail': 'Send Email',
      'resetPassword.sending': 'Sending...',
      'resetPassword.emailSent': 'Email sent successfully! Check your inbox and also the spam folder.',
      'resetPassword.enterEmail': 'Oops! We need your email to send recovery instructions.',
      'resetPassword.error': 'We couldn\'t send the email. Please check if the address is correct and try again.',
      'resetPassword.confirmInstructions': 'Enter the code sent to your email and your new password.',
      'resetPassword.codeLabel': 'Verification Code',
      'resetPassword.newPasswordLabel': 'New Password',
      'resetPassword.confirmPasswordLabel': 'Confirm New Password',
      'resetPassword.fillAllFields': 'Please fill in all fields to continue.',
      'resetPassword.passwordMismatch': 'Passwords do not match. Please enter the same password in both fields.',
      'resetPassword.resetPassword': 'Reset Password',
      'resetPassword.resetting': 'Resetting...',
      'resetPassword.success': 'Password reset successfully! You will be redirected to login shortly.',
      'resetPassword.backToLogin': 'Back to Login',

      // Email Verification
      'emailVerification.title': 'Verify Email',
      'emailVerification.instructions': 'Enter the verification code sent to your email.',
      'emailVerification.emailLabel': 'Email',
      'emailVerification.codeLabel': 'Verification Code',
      'emailVerification.verifyEmail': 'Verify Email',
      'emailVerification.verifying': 'Verifying...',
      'emailVerification.fillFields': 'Please fill in all fields.',
      'emailVerification.enterEmail': 'Please enter your email.',
      'emailVerification.codeSent': 'Code resent! Check your email.',
      'emailVerification.resendCode': 'Resend Code',
      'emailVerification.success': 'Email verified successfully! Welcome!',
      'emailVerification.error': 'Error verifying email. Please try again.',
      'emailVerification.invalidCode': 'Invalid code. Please check and try again.',
      'emailVerification.expiredCode': 'Code expired. Request a new code.',
      'emailVerification.notAuthorized': 'Not authorized. Please check your credentials.',
      'emailVerification.noCode': 'Didn\'t receive the code?',
      'emailVerification.backToLogin': 'Back to Login',

      // Dashboard
      'dashboard.welcome': 'Welcome to your dashboard',
      'dashboard.loggedIn': 'You are successfully logged in!',
      'dashboard.profileInfo': 'Profile Information',
      'dashboard.manageAccount': 'Manage your account settings and preferences.',
      'dashboard.editProfile': 'Edit Profile',
      'dashboard.recentActivity': 'Recent Activity',
      'dashboard.viewUpdates': 'View your recent interactions and updates.',
      'dashboard.viewActivity': 'View Activity',
      'dashboard.settings': 'Settings',
      'dashboard.configurePreferences': 'Configure your application preferences.',
      'dashboard.openSettings': 'Open Settings',
      'dashboard.logout': 'Logout',
      'dashboard.quickActions': 'Quick Actions',
      'dashboard.newProject': 'New Project',
      'dashboard.newTask': 'New Task',
      'dashboard.scheduleMeeting': 'Schedule Meeting',
      'dashboard.generateReport': 'Generate Report',
      'dashboard.analytics': 'Analytics',
      'dashboard.productivity': 'Productivity',
      'dashboard.teamPerformance': 'Team Performance',
      'dashboard.clientSatisfaction': 'Client Satisfaction',
      'dashboard.revenue': 'Revenue',
      'dashboard.fromLastMonth': 'from last month',
      'dashboard.projectProgress': 'Project Progress',
      'dashboard.due': 'Due',
      'dashboard.members': 'members',
      'dashboard.notifications': 'Notifications',
      'dashboard.dismissNotification': 'Dismiss notification',
      'dashboard.markAsRead': 'Mark as read',
      'dashboard.viewAll': 'View All',
      'dashboard.quickLinks': 'Quick Links',
      'dashboard.profile': 'Profile',
      'dashboard.reports': 'Reports',
      'dashboard.help': 'Help',
      'dashboard.projects': 'Projects',
      'dashboard.tasks': 'Tasks',
      'dashboard.completed': 'Completed',

      // About Section
      'about.title': 'About Us',
      'about.description': 'Ars Machina Consultancy is an emerging IT consulting company, passionate about transforming ideas into innovative digital solutions. Our young and dynamic team combines updated technical knowledge with creativity and dedication to help companies adapt to the digital world. We are very enthusiastic and committed to delivering exceptional results to our clients.',
      'about.projects': 'Completed Projects',
      'about.clients': 'Clients Served',
      'about.experience': 'Years of Experience',

      // Services Section
      'services.title': 'Our Services',
      'services.software.title': 'Software Development',
      'services.software.description': 'We create customized web and mobile applications, using the most modern technologies on the market.',
      'services.cloud.title': 'Cloud Computing',
      'services.cloud.description': 'Cloud infrastructure migration and optimization, ensuring scalability and efficiency.',
      'services.security.title': 'Cybersecurity',
      'services.security.description': 'Complete protection of your data and systems against digital threats.',
      'services.analytics.title': 'Data Analytics',
      'services.analytics.description': 'We transform data into valuable insights for strategic decision making.',
      'services.ai.title': 'Artificial Intelligence',
      'services.ai.description': 'We implement AI solutions to automate processes and increase productivity.',
      'services.consulting.title': 'Digital Consulting',
      'services.consulting.description': 'Specialized guidance for digitization and modernization of business processes.',

      // Blog Section
      'blog.title': 'Latest Posts',
      'blog.newPost': 'New Post',
      'blog.readMore': 'Read more about this fascinating post...',

      // Contact Section
      'contact.title': 'Get in Touch',
      'contact.description': 'Ready to transform your business? Let\'s talk!',
      'contact.location': 'São Luís, Brazil',
      'contact.sendMessage': 'Send a message',
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.message': 'Message',
      'contact.send': 'Send',

      // About Section - Mission and Team
      'about.mission.title': 'Our Mission',
      'about.mission.description': 'To provide innovative IT solutions that boost our clients\' growth and efficiency, using best practices and cutting-edge technologies.',
      'about.team.title': 'Our Team',
      'about.team.member1.name': 'João Silva',
      'about.team.member1.role': 'CEO & Founder',
      'about.team.member1.description': 'Expert in system architecture and development team leadership.',
      'about.team.member2.name': 'Maria Santos',
      'about.team.member2.role': 'Project Director',
      'about.team.member2.description': 'Manages complex projects and ensures delivery of high-quality solutions.',
      'about.team.member3.name': 'Carlos Oliveira',
      'about.team.member3.role': 'AI Specialist',
      'about.team.member3.description': 'Develops artificial intelligence solutions to optimize business processes.',

      // Services Section - Interactive
      'services.interactive.title': 'Why choose Ars Machina Consultancy?',
      'services.interactive.description': 'We offer personalized solutions that meet your business\'s specific needs, with a focus on innovation and measurable results.',
      'services.interactive.cta': 'Contact us',

      // Footer
      'footer.rights': 'All rights reserved.'
    }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language');
    const initialLanguage = (savedLanguage && this.translations[savedLanguage]) ? savedLanguage : 'pt';
    this.currentLanguage = new BehaviorSubject<string>(initialLanguage);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  setLanguage(language: string): void {
    if (this.translations[language]) {
      this.currentLanguage.next(language);
      localStorage.setItem('language', language);
    }
  }

  translate(key: string): string {
    const currentLang = this.currentLanguage.value;
    return this.translations[currentLang][key] || key;
  }

  getAvailableLanguages(): { code: string; name: string }[] {
    return [
      { code: 'pt', name: 'Português' },
      { code: 'en', name: 'English' }
    ];
  }
}
