import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="help-page">
      <div class="help-hero">
        <h1>❓ Central de Ajuda</h1>
        <p>Encontre respostas para suas dúvidas sobre nossos serviços</p>
      </div>
      
      <div class="help-content">
        <div class="help-section">
          <h2>📚 Perguntas Frequentes</h2>
          <div class="faq-list">
            <div class="faq-item">
              <h3>Como posso contratar os serviços?</h3>
              <p>Entre em contato conosco através do formulário de contato ou WhatsApp para discutir suas necessidades.</p>
            </div>
            <div class="faq-item">
              <h3>Quais tecnologias vocês utilizam?</h3>
              <p>Trabalhamos com as mais modernas tecnologias: Angular, React, Node.js, AWS, Azure e muito mais.</p>
            </div>
            <div class="faq-item">
              <h3>Oferecem suporte pós-projeto?</h3>
              <p>Sim, oferecemos suporte completo e manutenção contínua para todos os nossos projetos.</p>
            </div>
          </div>
        </div>
        
        <div class="help-section">
          <h2>📞 Contato</h2>
          <div class="contact-options">
            <a href="https://wa.me/5598999649215" class="contact-btn whatsapp">
              💬 WhatsApp
            </a>
            <a href="mailto:contato@arsmachinaconsultancy.com" class="contact-btn email">
              📧 Email
            </a>
            <a routerLink="/contact" class="contact-btn form">
              📝 Formulário
            </a>
          </div>
        </div>
        
        <div class="help-section">
          <h2>🔐 Área do Cliente</h2>
          <p>Para acessar recursos avançados como dashboard, relatórios e configurações, faça login em sua conta.</p>
          <a routerLink="/login" class="login-btn">
            🚀 Fazer Login
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .help-page {
      min-height: 100vh;
      padding: 100px 20px 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .help-hero {
      text-align: center;
      color: white;
      margin-bottom: 50px;
    }
    
    .help-hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .help-content {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    
    .help-section {
      background: var(--section-bg, white);
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .help-section h2 {
      margin-bottom: 20px;
      color: var(--text-primary, #333);
    }
    
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .faq-item {
      padding: 20px;
      background: var(--faq-bg, #f8f9fa);
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }
    
    .faq-item h3 {
      margin-bottom: 10px;
      color: #667eea;
    }
    
    .faq-item p {
      color: var(--text-secondary, #666);
      margin: 0;
    }
    
    .contact-options {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .contact-btn {
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .contact-btn.whatsapp {
      background: #25d366;
      color: white;
    }
    
    .contact-btn.email {
      background: #667eea;
      color: white;
    }
    
    .contact-btn.form {
      background: #28a745;
      color: white;
    }
    
    .contact-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .login-btn {
      display: inline-block;
      padding: 15px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      margin-top: 15px;
      transition: all 0.3s ease;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    @media (prefers-color-scheme: dark) {
      .help-section {
        --section-bg: #1a202c;
        --text-primary: #f7fafc;
        --text-secondary: #a0aec0;
        --faq-bg: #2d3748;
      }
    }
    
    @media (max-width: 768px) {
      .help-hero h1 {
        font-size: 2rem;
      }
      
      .help-section {
        padding: 20px;
      }
      
      .contact-options {
        flex-direction: column;
      }
      
      .contact-btn {
        text-align: center;
      }
    }
  `]
})
export class HelpPageComponent {}