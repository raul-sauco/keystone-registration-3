import { TestBed } from '@angular/core/testing';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { LocalizationService } from './localization.service';

describe('LocalizationService', () => {
  let service: LocalizationService;
  let translate: jasmine.SpyObj<TranslateService>;
  let langChange$: Subject<LangChangeEvent>;

  beforeEach(() => {
    langChange$ = new Subject<LangChangeEvent>();

    translate = jasmine.createSpyObj<TranslateService>(
      'TranslateService',
      ['getCurrentLang', 'use', 'instant'],
      {
        onLangChange: langChange$.asObservable(),
      },
    );

    translate.getCurrentLang.and.returnValue('en');
    translate.instant.and.callFake((key: string) => key);

    TestBed.configureTestingModule({
      providers: [
        LocalizationService,
        {
          provide: TranslateService,
          useValue: translate,
        },
      ],
    });

    service = TestBed.inject(LocalizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the current language initially', () => {
    expect(service.currentLanguage()).toBe('en');
  });

  it('should update when the language changes', () => {
    langChange$.next({
      lang: 'zh',
      translations: {},
    });

    expect(service.currentLanguage()).toBe('zh');
  });

  it('should expose isChinese', () => {
    expect(service.isChinese()).toBeFalse();

    langChange$.next({
      lang: 'zh-CN',
      translations: {},
    });

    expect(service.isChinese()).toBeTrue();
  });

  it('should delegate changeLanguage()', () => {
    service.changeLanguage('zh');

    expect(translate.use).toHaveBeenCalledWith('zh');
  });

  it('should delegate instant()', () => {
    translate.instant.and.returnValue('Hello');

    expect(service.instant('HELLO')).toBe('Hello');
    expect(translate.instant).toHaveBeenCalledWith('HELLO', undefined);
  });

  it('should pass params to instant()', () => {
    const params = { name: 'Raul' };

    service.instant('HELLO', params);

    expect(translate.instant).toHaveBeenCalledWith('HELLO', params);
  });
});
