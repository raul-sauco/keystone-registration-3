import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { Spied } from 'src/app/interfaces/spied';
import { Credentials } from 'src/app/models/credentials';
import { Student } from 'src/app/models/student';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StudentService } from 'src/app/services/student/student.service';
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
          userName: 'test',
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
    // studentSpy = jasmine.createSpyObj('Student', {
    //   getAttributeText: 'Mocked attribute text',
    // });
    // studentServiceSpy = jasmine.createSpyObj(
    //   'StudentService',
    //   { refreshStudent: null },
    //   {
    //     student$: of(studentSpy),
    //   }
    // );
    TestBed.configureTestingModule({
      declarations: [WaiverComponent],
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
        // TranslateModule.forRoot({
        //   loader: {
        //     provide: TranslateLoader,
        //     useFactory: HttpLoaderFactory,
        //     deps: [HttpClient],
        //   },
        // }),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        // { provide: StudentService, useValue: studentServiceSpy },
      ],
    }).compileComponents();
    // translate = TestBed.inject(TranslateService);
    // translate.setDefaultLang('en');
    // translate.use('en');
    // http = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiverComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should debug on init message', () => {
    expect(loggerSpy.debug).toHaveBeenCalledWith('WaiverComponent OnInit');
  });

  it('should get the credentials from the auth service', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledWith();
    // tick();
    // expect(authServiceSpy.getCredentials).toHaveBeenCalled();
    // expect(loggerSpy.error).toHaveBeenCalledWith(
    //   'WaiverComponent next student$'
    // );
  }));
});
