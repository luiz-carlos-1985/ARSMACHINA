import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../emailjs.config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    message: '',
  };

  isSubmitting = false;
  showAlternativeContact = false;

  constructor(public translationService: TranslationService) {}

  onSubmit() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.showErrorMessage('Por favor, preencha todos os campos do formulário.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contactForm.email)) {
      this.showErrorMessage('Por favor, insira um email válido.');
      return;
    }

    // Check if EmailJS is properly configured
    if (EMAILJS_CONFIG.serviceID === 'service_your_service_id' ||
        EMAILJS_CONFIG.templateID === 'template_your_template_id' ||
        EMAILJS_CONFIG.userID === 'your_public_key_here') {
      this.showAlternativeContactOptions();
      return;
    }

    this.sendEmailViaEmailJS();
  }

  private sendEmailViaEmailJS() {
    this.isSubmitting = true;

    const templateParams = {
      from_name: this.contactForm.name,
      from_email: this.contactForm.email,
      message: this.contactForm.message,
      to_email: 'contato@arsmachinaconsultancy.com',
    };

    emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams, EMAILJS_CONFIG.userID)
      .then(() => {
        this.showSuccessMessage();
        this.resetForm();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        this.handleEmailJSError(error);
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  private handleEmailJSError(error: any) {
    let errorMessage = 'Erro ao enviar a mensagem. ';

    if (error.status === 400) {
      errorMessage += 'Verifique se todos os campos estão preenchidos corretamente.';
    } else if (error.status === 401) {
      errorMessage += 'Configuração do EmailJS inválida.';
      this.showAlternativeContactOptions();
      return;
    } else if (error.status === 429) {
      errorMessage += 'Muitas tentativas. Tente novamente em alguns minutos.';
    } else {
      errorMessage += 'Tente uma das opções alternativas abaixo.';
      this.showAlternativeContactOptions();
      return;
    }

    this.showErrorMessage(errorMessage);
  }

  private showSuccessMessage() {
    const message = `
      ✅ Mensagem enviada com sucesso!
      
      Obrigado por entrar em contato, ${this.contactForm.name}!
      Responderemos em breve no email: ${this.contactForm.email}
    `;
    alert(message);
  }

  private showErrorMessage(message: string) {
    alert(`❌ ${message}`);
  }

  private showAlternativeContactOptions() {
    this.showAlternativeContact = true;
    
    const message = `
      📧 Formulário temporariamente indisponível
      
      Olá ${this.contactForm.name}! Use uma das opções abaixo para entrar em contato:
      
      📱 WhatsApp: +55 (11) 99999-9999
      📧 Email: contato@arsmachinaconsultancy.com
      
      Ou copie sua mensagem e envie diretamente por email.
    `;
    
    alert(message);
    
    // Copy message to clipboard
    this.copyMessageToClipboard();
  }

  private copyMessageToClipboard() {
    const fullMessage = `
Nome: ${this.contactForm.name}
Email: ${this.contactForm.email}

Mensagem:
${this.contactForm.message}

---
Enviado através do site Ars Machina Consultancy
    `.trim();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(fullMessage).then(() => {
        console.log('Mensagem copiada para a área de transferência');
      }).catch(err => {
        console.error('Erro ao copiar mensagem:', err);
      });
    }
  }

  private resetForm() {
    this.contactForm = { name: '', email: '', message: '' };
    this.showAlternativeContact = false;
  }

  // Alternative contact methods
  openWhatsApp() {
    const message = encodeURIComponent(`Olá! Meu nome é ${this.contactForm.name}. ${this.contactForm.message}`);
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  openEmailClient() {
    const subject = encodeURIComponent('Contato via Site - Ars Machina Consultancy');
    const body = encodeURIComponent(`
Nome: ${this.contactForm.name}
Email: ${this.contactForm.email}

Mensagem:
${this.contactForm.message}

---
Enviado através do site Ars Machina Consultancy
    `.trim());
    
    const mailtoUrl = `mailto:contato@arsmachinaconsultancy.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  }

  copyEmail() {
    const email = 'contato@arsmachinaconsultancy.com';
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        alert('📧 Email copiado: ' + email);
      }).catch(() => {
        alert('📧 Email: ' + email);
      });
    } else {
      alert('📧 Email: ' + email);
    }
  }

  dismissAlternativeContact() {
    this.showAlternativeContact = false;
  }
}
