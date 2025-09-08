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

    // For development/demo purposes, simulate successful form submission
    this.simulateFormSubmission();
  }

  private simulateFormSubmission() {
    this.isSubmitting = true;

    // Simulate network delay
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Show success message and provide alternative contact options
      this.showSuccessWithAlternatives();
      
      // Save form data to localStorage for demonstration
      this.saveFormDataLocally();
      
      // Reset form after successful submission
      this.resetForm();
    }, 2000);
  }

  private showSuccessWithAlternatives() {
    const message = `
      ✅ Formulário enviado com sucesso!
      
      Olá ${this.contactForm.name}!
      
      Sua mensagem foi registrada e será processada em breve.
      Para uma resposta mais rápida, use uma das opções abaixo:
      
      📱 WhatsApp: +55 98 99964-9215
      📧 Email: contato@arsmachinaconsultancy.com
      
      Responderemos no email: ${this.contactForm.email}
    `;
    
    alert(message);
    
    // Show alternative contact options
    this.showAlternativeContact = true;
    
    // Copy message to clipboard for convenience
    this.copyMessageToClipboard();
  }

  private saveFormDataLocally() {
    const formData = {
      ...this.contactForm,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    // Get existing form submissions
    const existingSubmissions = JSON.parse(localStorage.getItem('contactFormSubmissions') || '[]');
    
    // Add new submission
    existingSubmissions.push(formData);
    
    // Keep only last 10 submissions
    if (existingSubmissions.length > 10) {
      existingSubmissions.splice(0, existingSubmissions.length - 10);
    }
    
    // Save back to localStorage
    localStorage.setItem('contactFormSubmissions', JSON.stringify(existingSubmissions));
    
    console.log('Form data saved locally:', formData);
  }

  // Optional: Keep EmailJS functionality for when it's properly configured
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
}
