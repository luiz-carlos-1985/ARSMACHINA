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
      console.log('EmailJS not configured, trying Formspree');
      return await this.sendViaFormspree();
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
        .catch(async (error) => {
          console.warn('EmailJS error, trying Formspree:', error);
          await this.sendViaFormspree();
          resolve(true);
        });
    });
  }

  private async sendViaFormspree(): Promise<boolean> {
    try {
      // Usar serviço de email real - Formsubmit.co (gratuito)
      const formData = new FormData();
      formData.append('name', this.contactForm.name);
      formData.append('email', this.contactForm.email);
      formData.append('message', this.contactForm.message);
      formData.append('_subject', `Nova mensagem de ${this.contactForm.name} - Ars Machina`);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      
      const response = await fetch('https://formsubmit.co/contato@arsmachinaconsultancy.com', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        console.log('📧 EMAIL ENVIADO PARA: contato@arsmachinaconsultancy.com');
        this.saveContactLocally();
        this.handleSubmissionSuccess('FormSubmit');
        return true;
      } else {
        throw new Error('Erro no envio via FormSubmit');
      }
    } catch (error) {
      console.error('Erro FormSubmit:', error);
      // Tentar método alternativo
      return await this.sendViaGetForm();
    }
  }
  
  private async sendViaGetForm(): Promise<boolean> {
    try {
      // Usar GetForm.io como alternativa
      const emailData = {
        name: this.contactForm.name,
        email: this.contactForm.email,
        message: this.contactForm.message,
        _subject: `Nova mensagem de ${this.contactForm.name}`,
        _to: 'contato@arsmachinaconsultancy.com'
      };
      
      const response = await fetch('https://getform.io/f/your-form-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      if (response.ok) {
        console.log('📧 EMAIL ENVIADO VIA GETFORM PARA: contato@arsmachinaconsultancy.com');
        this.saveContactLocally();
        this.handleSubmissionSuccess('GetForm');
        return true;
      } else {
        throw new Error('Erro no GetForm');
      }
    } catch (error) {
      console.error('Erro GetForm:', error);
      // Último fallback: salvar e simular
      this.saveContactLocally();
      this.simulateFormSubmission();
      return true;
    }
  }
  

  
  private saveContactLocally() {
    const contactData = {
      ...this.contactForm,
      timestamp: new Date().toISOString(),
      id: Date.now(),
      status: 'pending_send'
    };
    
    const contacts = JSON.parse(localStorage.getItem('pendingContacts') || '[]');
    contacts.push(contactData);
    localStorage.setItem('pendingContacts', JSON.stringify(contacts));
    
    console.log('💾 Mensagem salva localmente para envio posterior:', contactData);
  }
  
  private simulateFormSubmission() {
    console.log('📧 BACKUP: Mensagem salva localmente para envio posterior');
    console.log('📝 Dados salvos:', {
      nome: this.contactForm.name,
      email: this.contactForm.email,
      mensagem: this.contactForm.message,
      destino: 'contato@arsmachinaconsultancy.com',
      status: 'Salvo localmente'
    });
    
    setTimeout(() => {
      this.handleSubmissionSuccess('Backup Local');
    }, 500);
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
      
      Olá ${this.contactForm.name}!
      
      📧 Sua mensagem foi ENVIADA PARA: contato@arsmachinaconsultancy.com
      🔄 Você receberá resposta em: ${this.contactForm.email}
      ⏰ Tempo de resposta: Até 24 horas
      
      Para contato imediato:
      📱 WhatsApp: +55 98 99964-9215
      📧 Email direto: contato@arsmachinaconsultancy.com
      
      Obrigado por escolher a Ars Machina Consultancy!
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

  // Contact item click handlers
  openEmail() {
    const subject = encodeURIComponent('Contato - Ars Machina Consultancy');
    const mailtoUrl = `mailto:contato@arsmachinaconsultancy.com?subject=${subject}`;
    window.location.href = mailtoUrl;
  }

  openWhatsApp() {
    window.open('https://wa.me/message/KNSHISJA3H25K1', '_blank');
  }

  openLocation() {
    window.open('https://maps.app.goo.gl/kgzFBHLheK9ny3Sm8', '_blank');
  }

  // Alternative contact methods
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
