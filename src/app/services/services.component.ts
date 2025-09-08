import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent {
  constructor(public translationService: TranslationService) {}

  contactUs() {
    window.open('https://wa.me/message/KNSHISJA3H25K1', '_blank', 'noopener');
  }
}
