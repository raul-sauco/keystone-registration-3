import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, tap, throwError } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';

@Injectable()
export class Auth401Interceptor implements HttpInterceptor {
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);
  private router = inject(Router);
  private http = inject(HttpClient);
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);
  private url: string;

  constructor() {
    const globals = inject(GlobalsService);
    this.url = globals.getApiUrl();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Avoid circular intercept of the refresh token request.
    if (req.url.endsWith('/auth/refresh') || req.url.endsWith('/auth/logout')) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401(req, next);
        }
        this.logger.error(err.error?.message || err.statusText);
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
    return this.http.get<{ access_token: string }>(
      `${this.url}auth/refresh`,
      { withCredentials: true }
    ).pipe(
      tap(res => this.auth.setAuth(res)),
      switchMap((res) => {
        const token = res.access_token;
        this.refreshing = false;
        this.refreshSubject.next(token);
        // Clone the request to update the access token.
        return next.handle(req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }));
      }),
      catchError(err => {
        this.refreshing = false;
        const cred = this.auth.credentials;
        this.logger.info(
          'Failed to refresh access token, logging out ' +
          (cred === null ? '' : `user ${cred?.username} student ID: ${cred?.studentId}`)
        );
        this.auth.logout();
        this.router.navigateByUrl('/login');
        return throwError(() => err);
      })
    );
  }
}
