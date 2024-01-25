import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, catchError, throwError } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';

@Injectable()
export class Auth401Interceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private logger: NGXLogger,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        const error = err.error?.message || err.statusText;
        if (err.status === 401) {
          const cred = this.auth.getCredentials();
          this.logger.warn(
            'Received 401 response from the server, logging out ' +
              `user ${cred?.username} student ID: ${cred?.studentId}`
          );
          this.auth.logout();
          this.router.navigateByUrl('/login');
        } else {
          this.logger.error(error);
        }
        return throwError(() => error);
      })
    );
  }
}
