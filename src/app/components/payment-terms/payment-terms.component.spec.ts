import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MarkdownModule } from 'ngx-markdown';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Spied } from '@interfaces/spied';
import { ApiService } from '@services/api/api.service';
import { PaymentTermsComponent } from './payment-terms.component';

describe('PaymentTermsComponent', () => {
  let component: PaymentTermsComponent;
  let fixture: ComponentFixture<PaymentTermsComponent>;
  let element: DebugElement;
  let apiServiceSpy: Spied<ApiService>;
  let loggerSpy: Spied<NGXLogger>;
  let translateSpy: Spied<TranslateService>;

  function bootstrapTestBed(lang: string) {
    apiServiceSpy = jasmine.createSpyObj('ApiService', {
      get: of({ text: 'Test', text_zh: 'Test ZH' }),
    });
    loggerSpy = jasmine.createSpyObj('Logger', {
      debug: undefined,
      error: undefined,
    });
    translateSpy = jasmine.createSpyObj('Translate', {}, { currentLang: lang });
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: TranslateService, useValue: translateSpy },
      ],
      declarations: [PaymentTermsComponent],
      imports: [
        MarkdownModule.forRoot(),
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
      ],
    });
    fixture = TestBed.createComponent(PaymentTermsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  }
  describe('using english translations', () => {
    beforeEach(() => bootstrapTestBed('en'));
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should display english text', fakeAsync(() => {
      // tick();
      const wrapper = element.query(By.css('#payment-terms'));
      expect(wrapper.nativeElement.textContent?.trim()).toEqual('Test');
    }));
  });

  describe('using chinese translations', () => {
    beforeEach(() => bootstrapTestBed('zh'));
    it('should display english text', fakeAsync(() => {
      Object.defineProperty(translateSpy, 'currentLang', { value: 'zh' });
      const wrapper = element.query(By.css('#payment-terms'));
      expect(wrapper.nativeElement.textContent?.trim()).toEqual('Test ZH');
    }));
  });
});
