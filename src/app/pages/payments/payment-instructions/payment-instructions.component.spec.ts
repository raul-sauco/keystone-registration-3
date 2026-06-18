import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { PaymentInstructionsComponent } from './payment-instructions.component';

describe('PaymentInstructionsComponent', () => {
  let component: PaymentInstructionsComponent;
  let fixture: ComponentFixture<PaymentInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatProgressSpinnerModule,
        LoggerTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
        PaymentInstructionsComponent,
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
