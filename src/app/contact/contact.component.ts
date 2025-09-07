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

  constructor(public translationService: TranslationService) {}

  onSubmit() {
    if (
      this.contactForm.name &&
      this.contactForm.email &&
      this.contactForm.message
    ) {
      // Check if EmailJS is properly configured
      if (EMAILJS_CONFIG.serviceID === 'service_your_service_id' ||
          EMAILJS_CONFIG.templateID === 'template_your_template_id' ||
          EMAILJS_CONFIG.userID === 'your_public_key_here') {
        alert('EmailJS não está configurado. Por favor, siga as instruções no arquivo EMAILJS_SETUP.md para configurar o serviço de email.');
        return;
      }

      const templateParams = {
        from_name: this.contactForm.name,
        from_email: this.contactForm.email,
        message: this.contactForm.message,
        to_email: 'contato@arsmachinaconsultancy.com',
      };

      // Show loading state
      const submitButton = document.querySelector('.submit-button') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
      }

      emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams, EMAILJS_CONFIG.userID)
        .then(() => {
          alert('Mensagem enviada com sucesso! Obrigado por entrar em contato.');
          this.contactForm = { name: '', email: '', message: '' };

          // Reset button
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = this.translationService.translate('contact.send');
          }
        }, (error) => {
          console.error('EmailJS error:', error);

          let errorMessage = 'Erro ao enviar a mensagem. ';

          if (error.status === 400) {
            errorMessage += 'Verifique se todos os campos estão preenchidos corretamente.';
          } else if (error.status === 401) {
            errorMessage += 'Configuração do EmailJS inválida. Verifique as credenciais.';
          } else if (error.status === 429) {
            errorMessage += 'Muitas tentativas. Tente novamente em alguns minutos.';
          } else {
            errorMessage += 'Por favor, tente novamente mais tarde ou entre em contato por WhatsApp.';
          }

          alert(errorMessage);

          // Reset button
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = this.translationService.translate('contact.send');
          }
        });
    } else {
      alert('Por favor, preencha todos os campos do formulário.');
    }
  }
}
