import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent {
  posts = [
    { title: 'Primeiro Post', content: 'Este é o conteúdo do primeiro post.' },
    { title: 'Segundo Post', content: 'Este é o conteúdo do segundo post.' },
    { title: 'Terceiro Post', content: 'Este é o conteúdo do terceiro post.' },
    { title: 'Tendências em TI 2025', content: 'Explore as principais tendências tecnológicas que estão moldando o futuro da indústria de TI.' },
    { title: 'Segurança Cibernética Essencial', content: 'Saiba como proteger seu negócio contra ameaças digitais com as melhores práticas de segurança.' },
    { title: 'Inteligência Artificial no Negócio', content: 'Descubra como a IA pode otimizar processos e aumentar a produtividade da sua empresa.' },
  ];

  constructor(public translationService: TranslationService) {}
}
