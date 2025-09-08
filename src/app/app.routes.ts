import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./todos/todos.component').then(m => m.TodosComponent) },
  { path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
  { path: 'services', loadComponent: () => import('./services/services.component').then(m => m.ServicesComponent) },
  { path: 'blog', loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent) },
  { path: 'blog/transformacao-digital', loadComponent: () => import('./blog/transformacao-digital.component').then(m => m.TransformacaoDigitalComponent) },
  { path: 'blog/cloud-computing', loadComponent: () => import('./blog/cloud-computing.component').then(m => m.CloudComputingComponent) },
  { path: 'blog/ciberseguranca', loadComponent: () => import('./blog/ciberseguranca.component').then(m => m.CibersegurancaComponent) },
  { path: 'blog/inteligencia-artificial', loadComponent: () => import('./blog/inteligencia-artificial.component').then(m => m.InteligenciaArtificialComponent) },
  { path: 'contact', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'email-verification', loadComponent: () => import('./email-verification/email-verification.component').then(m => m.EmailVerificationComponent) },
  { path: 'chatbot', loadComponent: () => import('./chatbot/chatbot.component').then(m => m.ChatbotComponent) },
  { path: 'help', loadComponent: () => import('./help-page/help-page.component').then(m => m.HelpPageComponent) },
];
