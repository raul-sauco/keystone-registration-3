import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';

import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { Spied } from 'src/app/interfaces/spied';
import { Credentials } from 'src/app/models/credentials';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ParticipantsComponent } from './participants.component';

describe('ParticipantsComponent', () => {
  let component: ParticipantsComponent;
  let fixture: ComponentFixture<ParticipantsComponent>;
  let authServiceSpy: Spied<AuthService>;
  let apiServiceSpy: Spied<ApiService>;
  let loggerSpy: Spied<NGXLogger>;

  beforeEach(waitForAsync(() => {
    authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      {
        getCredentials: new Credentials({
          userName: 'test',
          accessToken: 'test-token',
          type: 8, // School admin type
          studentId: undefined,
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
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
      declarations: [ParticipantsComponent],
      imports: [
        AdminBannerModule,
        HttpClientTestingModule,
        LoadingSpinnerContentModule,
        LoggerTestingModule,
        MatDialogModule,
        MatIconModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        NoopAnimationsModule,
        PipesModule,
        RouterTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call student service refresh', fakeAsync(() => {
    fixture.detectChanges();
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledWith();
    tick();
    expect(authServiceSpy.getCredentials).toHaveBeenCalled();
    tick();
  }));
});
