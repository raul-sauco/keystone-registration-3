import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

import { AuthState } from '@models/auth-state';
import { Credentials } from '@models/credentials';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logger = inject(NGXLogger);

  private readonly _auth$ = new BehaviorSubject<AuthState>(AuthState.Unknown);
  private _credentials: Credentials | null = null;
  private _accessToken: string | null = null;

  readonly auth$ = this._auth$.pipe(distinctUntilChanged());
  public redirectUrl?: string;

  constructor() {
    this.logger.debug('AuthService constructor');
  }

  setAuth(res: any) {
    this._accessToken = res.access_token;
    this._credentials = new Credentials(res.credentials);
    if (this.authenticated) {
      this.logger.debug(`AuthService: Updating Auth access token and credentials.`);
    } else {
      this._auth$.next(AuthState.Authenticated);
      this.logger.debug(`AuthService: Setting Auth access token and credentials.`
        + 'And updating authenticated state to `Authenticated');
    }
  }

  get accessToken(): string | null {
    return this._accessToken;
  }

  /** Return whether the current service state is `Authenticated` */
  get authenticated(): boolean {
    return this._auth$.value === AuthState.Authenticated;
  }

  get credentials(): Credentials | null {
    return this._credentials;
  }

  /** Return whether the current user is type teacher */
  get isTeacher(): boolean {
    return this.credentials?.type === 4;
  }

  /** Return whether the current user is type student */
  get isStudent(): boolean {
    return this.credentials?.type === 6;
  }

  /** Return whether the current user is type school admin */
  get isSchoolAdmin(): boolean {
    return this.credentials?.type === 8;
  }

  get isAccessTokenExpired(): boolean {
    const payload = this.accessToken !== null && JSON.parse(atob(this.accessToken.split('.')[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    if (exp > now) {
      this.logger.info(
        `Checking access token. Not Expired. Issued ${new Date(payload.iat * 1000).toLocaleString()} `
        + `Expires at: ${new Date(exp).toLocaleString()} `
        + `Has ${(exp - now) / 1000} seconds left`);
      return false;
    } else {
      this.logger.info(
        `Checking access token. Expired. Issued ${new Date(payload.iat * 1000).toLocaleString()} `
        + `Expired at: ${new Date(exp).toLocaleString()} `
        + `${Math.floor((now - exp) / 1000)} seconds ago`);
      return true;
    }
  }

  /**
   * Get the current authenticated state for the service.
   */
  get state(): AuthState {
    return this._auth$.value;
  }

  /** @deprecated Use `auth.credentials` instead */
  getCredentials(): Credentials | null {
    return this.credentials;
  }

  /** @deprecated Use `auth.accessToken` instead */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Checks whether the application has a user currently authenticated.
   * @deprecated Use `auth.authenticated` for sync and `auth.auth$` for async.
   */
  checkAuthenticated(): Promise<boolean> {
    this.logger.debug('AuthService.checkAuthenticated called');
    return new Promise<boolean>((resolve, _reject) => {
      resolve(this._auth$.value === AuthState.Authenticated);
    });
  }

  /** Remove all the login info associated with this user */
  logout(): void {
    this.logger.debug(`AuthService; logging out ${this.credentials?.username}`);
    this._credentials = null;
    this._accessToken = null;
    this._auth$.next(AuthState.Unauthenticated);
  }
}
