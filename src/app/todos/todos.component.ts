import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { TranslationService } from '../translation.service';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todos: any[] = [];
  currentLanguage = 'pt';

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.listTodos();
    this.initializeLanguageSubscription();
  }

  private initializeLanguageSubscription() {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  listTodos() {
    try {
      if (client?.models?.Todo) {
        client.models.Todo.observeQuery().subscribe({
          next: ({ items, isSynced }) => {
            this.todos = items;
          },
          error: (error) => {
            console.warn('GraphQL client not configured for development. Using mock data.', error);
            this.loadMockData();
          }
        });
      } else {
        console.warn('GraphQL client not configured for development. Using mock data.');
        this.loadMockData();
      }
    } catch (error) {
      console.warn('GraphQL client not configured for development. Using mock data.', error);
      this.loadMockData();
    }
  }

  private loadMockData() {
    this.todos = [
      { id: '1', content: 'Exemplo de postagem 1', createdAt: new Date().toISOString() },
      { id: '2', content: 'Exemplo de postagem 2', createdAt: new Date().toISOString() }
    ];
  }

  createTodo() {
    try {
      const content = window.prompt('Conteúdo da Postagem:');
      if (!content || content.trim() === '') {
        return;
      }
      if (content.trim().length < 3) {
        window.alert('O conteúdo da postagem deve ter pelo menos 3 caracteres.');
        return;
      }
      
      if (client?.models?.Todo) {
        client.models.Todo.create({
          content: content.trim(),
        });
      } else {
        console.warn('GraphQL client not configured. Cannot create todo.');
        window.alert('Funcionalidade não disponível no modo de desenvolvimento.');
      }
    } catch (error) {
      console.error('error creating posts', error);
    }
  }

  getTranslation(key: string): string {
    // This ensures the template updates when currentLanguage changes
    return this.translationService.translate(key);
  }

  openWhatsApp() {
    window.location.href = 'https://wa.me/5598999649215';
  }
}
