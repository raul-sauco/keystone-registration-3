import { MatDialogModule } from '@angular/material/dialog';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { PaymentUploadedComponent } from './payment-uploaded.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PaymentUploadedComponent', () => {
  let component: PaymentUploadedComponent;
  let fixture: ComponentFixture<PaymentUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LoggerTestingModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        RouterTestingModule,
        TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
        }), PaymentUploadedComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
