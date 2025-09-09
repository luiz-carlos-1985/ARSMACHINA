import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { TranslationService } from '../translation.service';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TranslationService, useValue: translationSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    expect(component.projects.length).toBeGreaterThan(0);
    expect(component.filteredProjects.length).toBeGreaterThan(0);
  });

  it('should filter projects by search term', () => {
    component.searchTerm = 'Sistema';
    component.onSearchChange();
    
    const filteredCount = component.filteredProjects.filter(p => 
      p.name.toLowerCase().includes('sistema')
    ).length;
    
    expect(component.filteredProjects.length).toBe(filteredCount);
  });

  it('should filter projects by status', () => {
    component.statusFilter = 'in-progress';
    component.onStatusFilterChange();
    
    const inProgressProjects = component.filteredProjects.filter(p => 
      p.status === 'in-progress'
    );
    
    expect(component.filteredProjects.length).toBe(inProgressProjects.length);
  });

  it('should navigate back to dashboard', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should export projects to CSV', () => {
    spyOn(component as any, 'downloadFile');
    component.exportProjects();
    expect((component as any).downloadFile).toHaveBeenCalled();
  });
});