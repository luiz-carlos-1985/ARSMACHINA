import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translation.service';

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
      alert('Mensagem enviada com sucesso! Obrigado por entrar em contato.');
      this.contactForm = { name: '', email: '', message: '' };
    } else {
      alert('Por favor, preencha todos os campos do formulário.');
    }
  }
}
