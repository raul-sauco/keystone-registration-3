import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { PaymentClosedComponent } from './payment-closed.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PaymentClosedComponent', () => {
  let component: PaymentClosedComponent;
  let fixture: ComponentFixture<PaymentClosedComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoadingSpinnerContentModule,
        LoggerTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
        PaymentClosedComponent,
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
