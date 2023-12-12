import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';

import { LoadingSpinnerContentModule } from '@components/loading-spinner-content/loading-spinner-content.module';
import { Spied } from '@interfaces/spied';
import { Credentials } from '@models/credentials';
import { Student } from '@models/student';
import { AuthService } from '@services/auth/auth.service';
import { StudentService } from '@services/student/student.service';
import { HttpLoaderFactory } from 'src/app/app.module';
import { WaiverContentComponent } from './waiver-content/waiver-content.component';
import { WaiverComponent } from './waiver.component';

describe('WaiverComponent', () => {
  let component: WaiverComponent;
  let fixture: ComponentFixture<WaiverComponent>;
  let authServiceSpy: Spied<AuthService>;
  let loggerSpy: Spied<NGXLogger>;
  let studentServiceSpy: Spied<StudentService>;
  let studentSpy: Spied<Student>;
  let translate: TranslateService;
  let http: HttpTestingController;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      {
        getCredentials: new Credentials({
          username: 'test',
          accessToken: 'test-token',
          type: 4, // Student type
          studentId: 22,
        }),
        checkAuthenticated: Promise.resolve(true),
      },
      { auth$: of(true) }
    );
    loggerSpy = jasmine.createSpyObj('NGXLogger', {
      debug: null,
      error: null,
    });
    studentSpy = jasmine.createSpyObj('Student', {
      getAttributeText: 'Mocked attribute text',
    });
    studentServiceSpy = jasmine.createSpyObj(
      'StudentService',
      { refreshStudent: null },
      {
        student$: of(studentSpy),
      }
    );
    TestBed.configureTestingModule({
      declarations: [WaiverComponent, WaiverContentComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        LoadingSpinnerContentModule,
        LoggerTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: StudentService, useValue: studentServiceSpy },
      ],
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    http = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiverComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should debug on init message', () => {
    expect(loggerSpy.debug).toHaveBeenCalledWith('WaiverComponent OnInit');
  });

  it('should get the credentials from the auth service', fakeAsync(() => {
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledWith();
    tick();
    // TODO: Fix this test
    // expect(authServiceSpy.getCredentials).toHaveBeenCalled();
    // expect(loggerSpy.error).toHaveBeenCalledWith('W');
  }));
});
