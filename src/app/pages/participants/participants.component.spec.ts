import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';
import { Spied } from 'src/app/interfaces/spied';
import { Credentials } from 'src/app/models/credentials';
import { LoadingSpinnerContentModule } from './../../components/loading-spinner-content/loading-spinner-content.module';
import { AuthService } from './../../services/auth/auth.service';
import { ParticipantsComponent } from './participants.component';

describe('ParticipantsComponent', () => {
  let component: ParticipantsComponent;
  let fixture: ComponentFixture<ParticipantsComponent>;
  let authServiceSpy: Spied<AuthService>;

  beforeEach(
    waitForAsync(() => {
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
      TestBed.configureTestingModule({
        providers: [{ provide: AuthService, useValue: authServiceSpy }],
        declarations: [ParticipantsComponent],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          LoadingSpinnerContentModule,
          LoggerTestingModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
          MatDialogModule,
          MatSnackBarModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
