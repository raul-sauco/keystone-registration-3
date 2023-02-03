import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { PaymentUploadProofComponent } from './payment-upload-proof.component';

describe('PaymentUploadProofComponent', () => {
  let component: PaymentUploadProofComponent;
  let fixture: ComponentFixture<PaymentUploadProofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        LoggerTestingModule,
        MatIconModule,
        RouterTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
      ],
      declarations: [PaymentUploadProofComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentUploadProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
