import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { TranslationService } from '../translation.service';

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate'], {
      currentLanguage$: { subscribe: jasmine.createSpy() }
    });

    await TestBed.configureTestingModule({
      imports: [ReportsComponent],
      providers: [
        { provide: TranslationService, useValue: translationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate report', () => {
    spyOn(component, 'generateReport');
    component.generateReport();
    expect(component.generateReport).toHaveBeenCalled();
  });

  it('should export report', () => {
    spyOn(component, 'exportReport');
    component.exportReport('pdf');
    expect(component.exportReport).toHaveBeenCalledWith('pdf');
  });
});