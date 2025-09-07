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
      const templateParams = {
        from_name: this.contactForm.name,
        from_email: this.contactForm.email,
        message: this.contactForm.message,
        to_email: 'contato@arsmachinaconsultancy.com',
      };

      emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams, EMAILJS_CONFIG.userID)
        .then(() => {
          alert('Mensagem enviada com sucesso! Obrigado por entrar em contato.');
          this.contactForm = { name: '', email: '', message: '' };
        }, (error) => {
          alert('Erro ao enviar a mensagem. Por favor, tente novamente mais tarde.');
          console.error('EmailJS error:', error);
        });
    } else {
      alert('Por favor, preencha todos os campos do formulário.');
    }
  }
}
