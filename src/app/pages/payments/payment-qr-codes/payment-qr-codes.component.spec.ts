import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { PaymentQrCodesComponent } from './payment-qr-codes.component';

describe('PaymentQrCodesComponent', () => {
  let component: PaymentQrCodesComponent;
  let fixture: ComponentFixture<PaymentQrCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        MatProgressSpinnerModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
      ],
      declarations: [PaymentQrCodesComponent],
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
