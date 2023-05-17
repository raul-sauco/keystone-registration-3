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
import { of } from 'rxjs';
import { HttpLoaderFactory } from 'src/app/app.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { Spied } from 'src/app/interfaces/spied';
import { Credentials } from 'src/app/models/credentials';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentClosedComponent } from './payment-closed/payment-closed.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { PaymentsComponent } from './payments.component';

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;
  let translate: TranslateService;
  let http: HttpTestingController;
  let authServiceSpy: Spied<AuthService>;

  beforeEach(waitForAsync(() => {
    authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      {
        getCredentials: new Credentials({
          username: 'test',
          accessToken: 'test-token',
          type: 8, // School admin type
          studentId: undefined,
        }),
        checkAuthenticated: Promise.resolve(true),
      },
      { auth$: of(true) }
    );
    TestBed.configureTestingModule({
      providers: [
        TranslateService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
      declarations: [
        PaymentsComponent,
        PaymentTermsComponent,
        PaymentClosedComponent,
      ],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
