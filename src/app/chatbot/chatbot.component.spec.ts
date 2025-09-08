import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot.component';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize minimized', () => {
    expect(component.isMinimized).toBeTruthy();
    expect(component.showInfoBalloon).toBeTruthy();
  });

  it('should toggle chat visibility', () => {
    const initialState = component.isMinimized;
    component.toggleChat();
    expect(component.isMinimized).toBe(!initialState);
  });

  it('should add bot message', () => {
    const testMessage = 'Test bot message';
    component.addBotMessage(testMessage);
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].sender).toBe('bot');
    expect(component.messages[0].message).toBe(testMessage);
  });

  it('should add user message', () => {
    const testMessage = 'Test user message';
    component.addUserMessage(testMessage);
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].sender).toBe('user');
    expect(component.messages[0].message).toBe(testMessage);
  });

  it('should generate response for greeting', () => {
    const response = component.generateResponse('olá');
    expect(response).toContain('Olá');
  });

  it('should handle empty input', async () => {
    component.userInput = '';
    await component.sendMessage();
    expect(component.messages.length).toBe(0);
  });
});