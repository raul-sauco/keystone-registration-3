import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MarkdownModule } from 'ngx-markdown';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Spied } from '@interfaces/spied';
import { PaymentInfo } from '@models/paymentInfo';
import { ApiService } from '@services/api/api.service';
import { PaymentService } from '@services/payment/payment.service';
import { PaymentTermsComponent } from './payment-terms.component';

describe('PaymentTermsComponent', () => {
  let component: PaymentTermsComponent;
  let fixture: ComponentFixture<PaymentTermsComponent>;
  let element: DebugElement;
  let apiServiceSpy: Spied<ApiService>;
  let paymentServiceSpy: Spied<PaymentService>;
  let loggerSpy: Spied<NGXLogger>;
  let translateSpy: Spied<TranslateService>;

  function bootstrapTestBed(params: any = {}) {
    if (params.required === undefined) {
      params.required = true;
    }
    if (params.lang === undefined) {
      params.lang = 'en';
    }
    apiServiceSpy = jasmine.createSpyObj('ApiService', {
      get: of({ text: 'Test', text_zh: 'Test ZH' }),
    });
    paymentServiceSpy = jasmine.createSpyObj(
      'PaymentService',
      {},
      {
        paymentInfo$: of(
          new PaymentInfo({
            required: params.required,
            open: true,
            termsAccepted: false,
            paid: false,
          })
        ),
      }
    );
    loggerSpy = jasmine.createSpyObj('Logger', {
      debug: undefined,
      error: undefined,
    });
    translateSpy = jasmine.createSpyObj(
      'Translate',
      {},
      { currentLang: params.lang }
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: PaymentService, useValue: paymentServiceSpy },
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
    beforeEach(() => bootstrapTestBed({ lang: 'en' }));
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should display english text', fakeAsync(() => {
      tick();
      const wrapper = element.query(By.css('#payment-terms'));
      expect(wrapper).toBeTruthy();
      expect(wrapper.nativeElement.textContent?.trim()).toEqual('Test');
    }));
  });

  describe('using chinese translations', () => {
    beforeEach(() => bootstrapTestBed({ lang: 'zh' }));
    it('should display english text', fakeAsync(() => {
      tick();
      const wrapper = element.query(By.css('#payment-terms'));
      expect(wrapper).toBeTruthy();
      expect(wrapper.nativeElement.textContent?.trim()).toEqual('Test ZH');
    }));
  });

  describe('when direct payment is not required', () => {
    beforeEach(() => bootstrapTestBed({ lang: 'en', required: false }));
    it('the payment terms should not be in the DOM', fakeAsync(() => {
      const wrapper = element.query(By.css('#payment-terms'));
      expect(wrapper).toBeNull();
    }));
  });
});
