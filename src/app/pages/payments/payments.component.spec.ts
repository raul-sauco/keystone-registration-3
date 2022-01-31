import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpLoaderFactory } from 'src/app/app.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { PaymentsComponent } from './payments.component';

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;
  let translate: TranslateService;
  let http: HttpTestingController;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [TranslateService],
        declarations: [PaymentsComponent, PaymentTermsComponent],
        imports: [
          LoadingSpinnerContentModule,
          HttpClientTestingModule,
          LoggerTestingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient],
            },
          }),
        ],
      }).compileComponents();
      translate = TestBed.inject(TranslateService);
      translate.setDefaultLang('en');
      translate.use('en');
      http = TestBed.inject(HttpTestingController);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
