import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { PaymentQrCodesComponent } from './payment-qr-codes.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PaymentQrCodesComponent', () => {
  let component: PaymentQrCodesComponent;
  let fixture: ComponentFixture<PaymentQrCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LoggerTestingModule,
        MatProgressSpinnerModule,
        TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
        }), PaymentQrCodesComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentQrCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
