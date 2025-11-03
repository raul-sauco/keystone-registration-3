import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';

import { Credentials } from '@models/credentials';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logger = inject(NGXLogger);

  private credentials?: Credentials;
  private accessToken: string | null = null;

  public authenticated = false;
  auth$: Subject<boolean> = new Subject<boolean>();
  public redirectUrl?: string;

  constructor() {
    this.logger.debug('AuthService constructor');
    this.checkAuthenticated().catch((error) => this.logger.warn(error));
  }

  setAuth(res: any) {
    this.accessToken = res.access_token;
    this.credentials = new Credentials(res.credentials);
    if (this.authenticated) {
      this.logger.debug(`AuthService: Updating Auth access token and credentials: ${res.access_token}`);
    } else {
      this.authenticated = true;
      this.auth$.next(this.authenticated);
      this.logger.debug(`AuthService: Setting Auth access token and credentials: ${res.access_token}. `
        + 'And updating authenticated status to `true`');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
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

  /** Return the current credentials if any, null otherwise */
  getCredentials(): Credentials | undefined {
    return this.credentials;
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

  /**
   * Checks whether the application has a user currently authenticated.
   * TODO: Get rid of this method, should just use sync auth.isAuthenticated
   */
  checkAuthenticated(): Promise<boolean> {
    this.logger.debug('AuthService.checkAuthenticated called');
    return new Promise<boolean>((resolve, _reject) => {
      resolve(this.authenticated);
    });
  }

  /** Remove all the login info associated with this user */
  logout(): void {
    if (this.credentials) {
      this.logger.debug(
        `AuthService; logging out ${this.credentials.username}`
      );
    }
    this.credentials = undefined;
    this.accessToken = null;
    this.authenticated = false;
    this.auth$.next(this.authenticated);
  }
}
