import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';
import { AdminBannerModule } from '@components/admin-banner/admin-banner.module';
import { Spied } from '@interfaces/spied';
import { Credentials } from '@models/credentials';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@services/auth/auth.service';
import { AppComponent } from 'src/app/app.component';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
// Define some defaults.
const imports = [
  RouterTestingModule,
  HttpClientTestingModule,
  LoggerTestingModule,
  // TranslateTestingModule.withTranslations({
  //   en: require('src/assets/i18n/en.json'),
  // }),
  BrowserAnimationsModule, // Material needs animations
  MatBadgeModule,
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  AdminBannerModule,
];
const declarations = [AppComponent, MockTranslatePipe];
const credentials1 = {
  username: 'test',
  accessToken: 'test-token',
  type: 8, // School admin type
  studentId: undefined,
};
const defaultAuthServiceSpy: Spied<AuthService> = jasmine.createSpyObj(
  'AuthService',
  {
    getCredentials: new Credentials(credentials1),
    checkAuthenticated: Promise.resolve(true),
  },
  { auth$: of(true) }
);

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let appElement: HTMLElement;

  describe('with school admin credentials', () => {
    let translateServiceSpy: Spied<TranslateService>;
    beforeEach(() => {
      translateServiceSpy = jasmine.createSpyObj(
        'TranslateService',
        {
          get: of('test-translation'),
          setDefaultLang: null,
          getBrowserLang: 'en-US',
          use: of(true),
        },
        { currentLang: 'zh-CN' }
      );
      TestBed.configureTestingModule({
        providers: [
          AppComponent,
          { provide: AuthService, useValue: defaultAuthServiceSpy },
          { provide: TranslateService, useValue: translateServiceSpy },
        ],
        imports,
        declarations: [AppComponent, MockTranslatePipe],
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      appElement = fixture.nativeElement;
    });

    it('should create the app and set the language', () => {
      expect(component).toBeDefined();
      expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('en-US');
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

  describe('with student credentials and chinese translate service', () => {
    const studentCredentials = { ...credentials1, ...{ type: 4 } };
    let translateServiceSpy: Spied<TranslateService>;
    beforeEach(() => {
      translateServiceSpy = jasmine.createSpyObj(
        'TranslateService',
        {
          get: of('test-translation-zh'),
          setDefaultLang: null,
          getBrowserLang: 'zh-CN',
          use: of(true),
        },
        { currentLang: 'zh-CN' }
      );
      const studentAuthServiceSpy: Spied<AuthService> = jasmine.createSpyObj(
        'AuthService',
        {
          getCredentials: new Credentials(studentCredentials),
          checkAuthenticated: Promise.resolve(true),
        },
        { auth$: of(true) }
      );
      TestBed.configureTestingModule({
        providers: [
          AppComponent,
          { provide: AuthService, useValue: studentAuthServiceSpy },
          { provide: TranslateService, useValue: translateServiceSpy },
        ],
        imports,
        declarations,
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      appElement = fixture.nativeElement;
    });

    it('should set the application language to Chinese', () => {
      expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('zh-cmn-Hans');
    });
  });

  describe('with default language', () => {
    let translateServiceSpy: Spied<TranslateService>;
    beforeEach(() => {
      translateServiceSpy = jasmine.createSpyObj(
        'TranslateService',
        {
          get: of('test-translation-zh'),
          setDefaultLang: null,
          getBrowserLang: null,
          use: of(true),
        },
        { currentLang: 'zh-CN' }
      );
      TestBed.configureTestingModule({
        providers: [
          AppComponent,
          { provide: AuthService, useValue: defaultAuthServiceSpy },
          { provide: TranslateService, useValue: translateServiceSpy },
        ],
        imports,
        declarations,
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      appElement = fixture.nativeElement;
    });

    it('should default to English when it fails to detect browser language', () => {
      expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('en');
    });
  });
});
