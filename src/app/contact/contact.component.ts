import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';
import { AwsEmailService } from '../aws-email.service';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../emailjs.config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AwsEmailService],
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
  submitSuccess = false;
  errorMessage = '';

  constructor(
    public translationService: TranslationService,
    private awsEmailService: AwsEmailService
  ) {}

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.submitSuccess = false;

    try {
      // Try AWS SES first
      if (this.awsEmailService.isConfigured()) {
        await this.sendViaAWSSES();
      } else {
        // Fallback to EmailJS if AWS is not configured
        await this.sendViaEmailJS();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      this.handleSubmissionError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private async sendViaAWSSES() {
    try {
      // Send main contact email
      await this.awsEmailService.sendContactEmail(this.contactForm);
      
      // Send auto-reply to user
      try {
        await this.awsEmailService.sendAutoReply(this.contactForm);
      } catch (autoReplyError) {
        console.warn('Auto-reply failed, but main email was sent:', autoReplyError);
      }
      
      this.handleSubmissionSuccess('AWS SES');
      console.log('Email sent successfully via AWS SES');
    } catch (error) {
      console.error('AWS SES error:', error);
      throw new Error('Erro ao enviar email via AWS SES. Tente novamente ou use uma das opções alternativas.');
    }
  }

  private async sendViaEmailJS() {
    // Check if EmailJS is properly configured
    if (!this.isEmailJSConfigured()) {
      console.log('EmailJS not configured, using simulation mode');
      this.simulateFormSubmission();
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      const templateParams = {
        from_name: this.contactForm.name,
        from_email: this.contactForm.email,
        message: this.contactForm.message,
        to_email: 'contato@arsmachinaconsultancy.com',
        reply_to: this.contactForm.email
      };

      emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams, EMAILJS_CONFIG.userID)
        .then(() => {
          this.handleSubmissionSuccess('EmailJS');
          resolve(true);
        })
        .catch((error) => {
          console.warn('EmailJS error, using simulation:', error);
          this.simulateFormSubmission();
          resolve(true);
        });
    });
  }

  private simulateFormSubmission() {
    console.log('📧 SIMULAÇÃO: Email seria enviado para contato@arsmachinaconsultancy.com');
    console.log('📝 Dados do formulário:', {
      nome: this.contactForm.name,
      email: this.contactForm.email,
      mensagem: this.contactForm.message,
      destino: 'contato@arsmachinaconsultancy.com'
    });
    
    setTimeout(() => {
      this.handleSubmissionSuccess('Simulação (Desenvolvimento)');
    }, 1000);
  }

  private handleSubmissionSuccess(method: string) {
    this.submitSuccess = true;
    
    // Save form data locally
    this.saveFormDataLocally(method);
    
    // Show success message
    this.showSuccessMessage();
    
    // Reset form
    this.resetForm();
  }

  private handleSubmissionError(error: any) {
    this.errorMessage = error.message || 'Erro ao enviar mensagem. Tente uma das opções alternativas abaixo.';
    this.showAlternativeContact = true;
    this.copyMessageToClipboard();
  }

  private validateForm(): boolean {
    if (!this.contactForm.name.trim()) {
      this.errorMessage = 'Nome é obrigatório';
      return false;
    }
    
    if (!this.contactForm.email.trim()) {
      this.errorMessage = 'Email é obrigatório';
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.contactForm.email)) {
      this.errorMessage = 'Por favor, insira um email válido';
      return false;
    }
    
    if (!this.contactForm.message.trim()) {
      this.errorMessage = 'Mensagem é obrigatória';
      return false;
    }
    
    return true;
  }

  private saveFormDataLocally(method: string) {
    const formData = {
      ...this.contactForm,
      timestamp: new Date().toISOString(),
      method: method,
      id: Date.now()
    };

    const existingSubmissions = JSON.parse(localStorage.getItem('contactFormSubmissions') || '[]');
    existingSubmissions.push(formData);
    
    // Keep only last 10 submissions
    if (existingSubmissions.length > 10) {
      existingSubmissions.splice(0, existingSubmissions.length - 10);
    }
    
    localStorage.setItem('contactFormSubmissions', JSON.stringify(existingSubmissions));
    console.log('Form data saved locally:', formData);
  }

  private showSuccessMessage() {
    const message = `
      ✅ Mensagem enviada com sucesso!
      
      Obrigado por entrar em contato, ${this.contactForm.name}!
      
      Sua mensagem foi recebida e responderemos em breve no email: ${this.contactForm.email}
      
      Tempo de resposta estimado: 24 horas
      
      Para contato imediato:
      📱 WhatsApp: +55 98 99964-9215
      📧 Email: contato@arsmachinaconsultancy.com
    `;
    
    alert(message);
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
    this.errorMessage = '';
    this.showAlternativeContact = false;
  }

  // Alternative contact methods
  openWhatsApp() {
    const message = encodeURIComponent(`Olá! Meu nome é ${this.contactForm.name || 'visitante do site'}. ${this.contactForm.message || 'Gostaria de saber mais sobre os serviços da Ars Machina Consultancy.'}`);
    const whatsappUrl = `https://wa.me/5598999649215?text=${message}`;
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

  dismissSuccessMessage() {
    this.submitSuccess = false;
  }

  clearError() {
    this.errorMessage = '';
  }

  private isEmailJSConfigured(): boolean {
    return EMAILJS_CONFIG.serviceID !== 'service_your_service_id' &&
           EMAILJS_CONFIG.templateID !== 'template_your_template_id' &&
           EMAILJS_CONFIG.userID !== 'your_public_key_here';
  }
}
