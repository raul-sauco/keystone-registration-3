import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { PaymentInstructionsComponent } from './payment-instructions.component';

describe('PaymentInstructionsComponent', () => {
  let component: PaymentInstructionsComponent;
  let fixture: ComponentFixture<PaymentInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
      imports: [
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        LoggerTestingModule,
      ],
      declarations: [PaymentInstructionsComponent],
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
