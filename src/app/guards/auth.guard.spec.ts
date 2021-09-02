// Example code found at:
// https://keepgrowing.in/angular/how-to-test-angular-authguard-examples-for-the-canactivate-interface/
// run locally this test with:
// ng test --include='**/app/guards/auth.guard.spec.ts' --browsers=Chrome --code-coverage --no-watch

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let injector: TestBed;
  let authService: AuthService;
  let guard: AuthGuard;
  const requestedUrl = '/itinerary';
  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: requestedUrl };
  const routerMock = { navigateByUrl: jasmine.createSpy('navigateByUrl') };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [AuthGuard, { provide: Router, useValue: routerMock }],
        imports: [
          HttpClientTestingModule,
          LoggerTestingModule,
          RouterTestingModule,
        ],
      });
      injector = getTestBed();
      authService = injector.inject(AuthService);
      guard = injector.inject(AuthGuard);
    })
  );

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect an unauthenticated user to the login route', () => {
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should redirect an unauthenticated user to the login route using async login check', async () => {
    authService.authenticated = true;
    spyOn(authService, 'checkAuthenticated').and.returnValue(
      Promise.resolve(false)
    );
    expect(await guard.canActivate(routeMock, routeStateMock)).toEqual(false);
  });

  it('should allow the authenticated user to access app', async () => {
    authService.authenticated = true;
    spyOn(authService, 'checkAuthenticated').and.returnValue(
      Promise.resolve(true)
    );
    expect(await guard.canActivate(routeMock, routeStateMock)).toEqual(true);
  });

  it('should remember the requested url for failed logins', async () => {
    authService.authenticated = false;
    spyOn(authService, 'checkAuthenticated').and.returnValue(
      Promise.resolve(false)
    );
    expect(await guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    expect(authService.redirectUrl).toEqual(requestedUrl);
  });
});
