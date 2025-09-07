import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformacaoDigitalComponent } from './transformacao-digital.component';

describe('TransformacaoDigitalComponent', () => {
  let component: TransformacaoDigitalComponent;
  let fixture: ComponentFixture<TransformacaoDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformacaoDigitalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransformacaoDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
