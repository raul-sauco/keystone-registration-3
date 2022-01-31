import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { HttpLoaderFactory } from 'src/app/app.module';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { PaymentTermsComponent } from './payment-terms.component';

describe('PaymentTermsComponent', () => {
  let component: PaymentTermsComponent;
  let fixture: ComponentFixture<PaymentTermsComponent>;
  let translate: TranslateService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PaymentTermsComponent],
        imports: [
          HttpClientTestingModule,
          LoggerTestingModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
        ],
      }).compileComponents();
      translate = TestBed.inject(TranslateService);
      translate.setDefaultLang('en');
      translate.use('en');
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
