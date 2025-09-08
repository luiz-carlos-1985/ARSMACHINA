import { TranslatePipe } from './translate.pipe';
import { TranslationService } from './translation.service';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(() => {
    const translationSpy = jasmine.createSpyObj('TranslationService', ['translate']);
    mockTranslationService = translationSpy;
    pipe = new TranslatePipe(mockTranslationService);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform key to translation', () => {
    mockTranslationService.translate.and.returnValue('Translated Text');
    
    const result = pipe.transform('test.key');
    
    expect(mockTranslationService.translate).toHaveBeenCalledWith('test.key');
    expect(result).toBe('Translated Text');
  });

  it('should handle empty key', () => {
    mockTranslationService.translate.and.returnValue('');
    
    const result = pipe.transform('');
    
    expect(result).toBe('');
  });
});