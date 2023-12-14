import { Location } from '@angular/common';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TeacherGuard } from '@guards/teacher.guard';
import { Spied } from '@interfaces/spied';
import { Credentials } from '@models/credentials';
import { AuthService } from '@services/auth/auth.service';
import { AppRoutingModule } from './app-routing.module';

describe('AppRoutingModule', () => {
  jasmine.getEnv().allowRespy(true);
  const mockCredentialsData = {
    username: 'test',
    accessToken: 'test-token',
    type: 8, // School admin type
    studentId: undefined,
  };
  let location: Location;
  let router: Router;
  let authServiceSpy: Spied<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      {
        getCredentials: new Credentials(mockCredentialsData),
        checkAuthenticated: Promise.resolve(true),
      },
      {
        auth$: of(true),
        authenticated: true,
        isTeacher: false,
      }
    );
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), AppRoutingModule],
      providers: [
        TeacherGuard,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  describe('unguarded routes', () => {
    const routes = [
      'home',
      'home/123',
      'program-overview',
      'program-overview/123',
      'packing-list',
      'packing-list/123',
      'guides',
      'guides/123',
      'faq',
      'faq/123',
      'documents',
      'documents/123',
      'accommodation',
      'accommodation/123',
      'payment-policy',
      'privacy-policy',
      'privacy-policy/123',
      'covid-policy',
      'child-protection',
      'teacher-note',
      'help',
      'waiver',
    ];
    routes.forEach((route) => {
      it(`should navigate to ${route} path`, waitForAsync(async () => {
        await router.navigate([route]);
        expect(router.url).toBe('/' + route);
      }));
    });
  });

  describe('routes behind TeacherGuard', () => {
    // The first three ways of mocking the spy do not seem to work.
    // authServiceSpy.isTeacher().and.return(true);
    // spyOnProperty(authServiceSpy, 'isTeacher', 'get').and.returnValue(true);
    // Object.getOwnPropertyDescriptor(authServiceSpy, 'isTeacher').get.and.return(
    //   true
    // );
    const routes = ['feedback', 'participants'];
    routes.forEach((route) => {
      it(`should navigate to ${route} path`, waitForAsync(async () => {
        const spy = jasmine.createSpy().and.returnValue(true);
        Object.defineProperty(authServiceSpy, 'isTeacher', {
          get: spy,
        });
        await router.navigate([route]);
        expect(router.url).toBe('/' + route);
        expect(spy).toHaveBeenCalled();
      }));

      it(`should fail to navigate to ${route} path`, waitForAsync(async () => {
        const spy = jasmine.createSpy().and.returnValue(false);
        Object.defineProperty(authServiceSpy, 'isTeacher', {
          get: spy,
        });
        await router.navigate([route]);
        expect(router.url).toBe('/');
        expect(spy).toHaveBeenCalled();
      }));
    });
  });

  describe('routes behind AuthGuard', () => {
    const routes = ['personal-info', 'payments'];
    routes.forEach((route) => {
      it(`should navigate to ${route} path`, waitForAsync(async () => {
        const spy = jasmine.createSpy().and.returnValue(true);
        Object.defineProperty(authServiceSpy, 'authenticated', {
          get: spy,
        });
        await router.navigate([route]);
        expect(router.url).toBe('/' + route);
        expect(spy).toHaveBeenCalled();
      }));

      it(`should fail to navigate to ${route} path`, waitForAsync(async () => {
        const spy = jasmine.createSpy().and.returnValue(false);
        Object.defineProperty(authServiceSpy, 'authenticated', {
          get: spy,
        });
        await router.navigate([route]);
        expect(router.url).toBe('/');
        expect(spy).toHaveBeenCalled();
      }));
    });
  });

  describe('routes behind NoAuthGuard', () => {
    const routes = [
      'login',
      'register',
      'trip-codes',
      'trip-codes/143',
      'forgot-password',
      'reset-password/888',
    ];
    routes.forEach((route) => {
      it(`should navigate to ${route} path`, waitForAsync(async () => {
        // By default authenticated will be true and navigation should fail
        await router.navigate([route]);
        expect(router.url).toBe('/');
      }));

      it(`should fail to navigate to ${route} path`, waitForAsync(async () => {
        const spy = jasmine.createSpy().and.returnValue(false);
        Object.defineProperty(authServiceSpy, 'authenticated', {
          get: spy,
        });
        spyOn(authServiceSpy, 'checkAuthenticated').and.returnValue(
          Promise.resolve(false)
        );
        await router.navigate([route]);
        expect(router.url).toBe('/' + route);
        expect(spy).toHaveBeenCalled();
      }));
    });
  });

  it(`should navigate to trip-switcher path`, waitForAsync(async () => {
    await router.navigate(['trip-switcher']);
    expect(router.url).toBe('/trip-switcher');
  }));

  it(`should fail to navigate to trip-switcher path`, waitForAsync(async () => {
    spyOn(authServiceSpy, 'getCredentials').and.returnValue(
      new Credentials({ ...mockCredentialsData, ...{ type: 4 } })
    );
    await router.navigate(['trip-switcher']);
    expect(router.url).toBe('/');
  }));

  it(`should navigate to fallback path`, waitForAsync(async () => {
    await router.navigate(['']);
    expect(router.url).toBe('/home');
  }));
});
