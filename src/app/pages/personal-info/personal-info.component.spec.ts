import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { Spied } from 'src/app/interfaces/spied';
import { Credentials } from 'src/app/models/credentials';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PersonalInfoComponent } from './personal-info.component';

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;
  let authServiceSpy: Spied<AuthService>;
  let apiServiceSpy: Spied<ApiService>;
  let loggerSpy: Spied<NGXLogger>;
  let element: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      authServiceSpy = jasmine.createSpyObj(
        'AuthService',
        {
          getCredentials: new Credentials({
            userName: 'test',
            accessToken: 'test-token',
            type: 4, // Student type
            studentId: 123,
          }),
          checkAuthenticated: Promise.resolve(true),
        },
        { auth$: of(true) }
      );
      apiServiceSpy = jasmine.createSpyObj('ApiService', {
        get: of({ id: 123 }),
      });
      loggerSpy = jasmine.createSpyObj('Logger', {
        debug: undefined,
        error: undefined,
      });
      TestBed.configureTestingModule({
        declarations: [PersonalInfoComponent],
        imports: [
          HttpClientTestingModule,
          FormsModule,
          LoadingSpinnerContentModule,
          LoggerTestingModule,
          MatSnackBarModule,
          ReactiveFormsModule,
          RouterTestingModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
        ],
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          { provide: ApiService, useValue: apiServiceSpy },
          { provide: NGXLogger, useValue: loggerSpy },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(PersonalInfoComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a loading spinner while fetching the information', () => {
    fixture.detectChanges();
    const spinner = element.querySelector('app-loading-spinner-content');
    expect(spinner).toBeTruthy();
  });

  it('ngOnInit should call fetch', fakeAsync(() => {
    spyOn(component, 'fetch').and.returnValue();
    fixture.detectChanges();
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledOnceWith();
    tick();
    expect(authServiceSpy.getCredentials).toHaveBeenCalled();
    expect(component.fetch).toHaveBeenCalled();
    tick();
  }));

  it('ngOnInit should not mark login required', fakeAsync(() => {
    spyOn(component, 'fetch').and.returnValue();
    authServiceSpy.checkAuthenticated.and.returnValue(Promise.resolve(false));
    fixture.detectChanges();
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledOnceWith();
    tick();
    expect(component.needsLogin).toEqual(true);
  }));

  it('ngOnInit should not mark login required when no auth token', fakeAsync(() => {
    spyOn(component, 'fetch').and.returnValue();
    authServiceSpy.getCredentials.and.returnValue(
      new Credentials({
        userName: 'test',
        accessToken: '',
        type: 4, // Student type
        studentId: 123,
      })
    );
    fixture.detectChanges();
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledOnceWith();
    tick();
    expect(component.needsLogin).toEqual(true);
    expect(loggerSpy.error).toHaveBeenCalledOnceWith(
      'Authentication error, expected access token.'
    );
  }));

  it('ngOnInit should not mark login required when no student id', fakeAsync(() => {
    spyOn(component, 'fetch').and.returnValue();
    authServiceSpy.getCredentials.and.returnValue(
      new Credentials({
        userName: 'test',
        accessToken: 'test-token',
        type: 4, // Student type
        studentId: undefined,
      })
    );
    fixture.detectChanges();
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledOnceWith();
    tick();
    // We have auth token, it is an error but not a need-login error
    expect(component.needsLogin).toEqual(false);
    expect(loggerSpy.error).toHaveBeenCalledOnceWith(
      'Authentication error, expected valid student ID.'
    );
  }));

  it('ngOnInit should mark login required when no credentials', fakeAsync(() => {
    spyOn(component, 'fetch').and.returnValue();
    authServiceSpy.getCredentials.and.returnValue(undefined);
    fixture.detectChanges();
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledOnceWith();
    tick();
    // We have auth token, it is an error but not a need-login error
    expect(component.needsLogin).toEqual(true);
    expect(loggerSpy.error).toHaveBeenCalledOnceWith(
      'Authentication error, expected having auth info.'
    );
  }));
});
