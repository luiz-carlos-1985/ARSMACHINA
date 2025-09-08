import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { ThemeService } from './theme.service';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NavigationComponent, ChatbotComponent, ThemeToggleComponent],
})
export class AppComponent implements OnInit {
  title = 'ars-machina-consultancy';
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    // Initialize theme on app start
    this.themeService.setTheme(this.themeService.getCurrentTheme());
  }
}
