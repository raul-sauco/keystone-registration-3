import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { Spied } from 'src/app/interfaces/spied';
import { Credentials } from 'src/app/models/credentials';
import { AuthService } from 'src/app/services/auth/auth.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let appElement: HTMLElement;
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
        AppComponent,
        { provide: AuthService, useValue: authServiceSpy },
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
        BrowserAnimationsModule, // Material needs animations
        MatBadgeModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        AdminBannerModule,
      ],
      declarations: [AppComponent],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    appElement = fixture.nativeElement;
  });

  it('should create the app', () => {
    expect(component).toBeDefined();
  });

  it(`should have as title 'Keystone Adventures'`, () => {
    expect(component.title).toEqual('Keystone Adventures');
  });

  it('should have a side-menu', () => {
    const sideNav = appElement.querySelector('mat-sidenav');
    expect(sideNav).toBeTruthy();
    fixture.detectChanges();
    expect(sideNav!.textContent).toContain('HOME');
  });

  it('should have access to credentials from AuthService', () => {
    expect(component.auth.getCredentials()?.username).toBe(
      'test',
      'wrong username'
    );
  });

  it('should have received true on the auth$ subscription', () => {
    component.auth.auth$.subscribe((result) => {
      expect(result).toBeTruthy();
    });
  });
});
