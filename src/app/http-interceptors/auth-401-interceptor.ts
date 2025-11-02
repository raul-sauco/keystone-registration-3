import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';

@Injectable()
export class Auth401Interceptor implements HttpInterceptor {
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);
  private router = inject(Router);
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401(req, next);
        } else {
          const error = err.error?.message || err.statusText;
          this.logger.error(error);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.refreshing) {
      return this.refreshSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })))
      );
    }
    this.refreshing = true;
    this.refreshSubject.next(null);
    return this.auth.refreshToken().pipe(
      switchMap((newToken: string) => {
        this.refreshing = false;
        this.refreshSubject.next(newToken);
        // Clone the request to update the access token.
        return next.handle(req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` }
        }));
      }),
      catchError(err => {
        this.refreshing = false;
        const cred = this.auth.getCredentials();
        this.logger.info(
          'Failed to refresh access token, logging out ' +
          `user ${cred?.username} student ID: ${cred?.studentId}`
        );
        this.auth.logout();
        this.router.navigateByUrl('/login');
        return throwError(() => err);
      })
    );
  }
}
