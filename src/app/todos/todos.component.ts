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
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      console.error('error fetching posts!', error);
    }
  }

  createTodo() {
    try {
      client.models.Todo.create({
        content: window.prompt('Conteúdo da Postagem:'),
      });
      this.listTodos();
    } catch (error) {
      console.error('error creating posts', error);
    }
  }

  getTranslation(key: string): string {
    // This ensures the template updates when currentLanguage changes
    return this.translationService.translate(key);
  }
}
