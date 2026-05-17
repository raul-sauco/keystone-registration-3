import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, firstValueFrom } from 'rxjs';

import { AuthState } from '@models/auth-state';
import { Credentials } from '@models/credentials';
import { GlobalsService } from '@services/globals/globals.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logger = inject(NGXLogger);
  private http = inject(HttpClient);

  private readonly _auth = signal<AuthState>(AuthState.Unknown);

  private _credentials: Credentials | null = null;
  private _accessToken: string | null = null;
  private apiUrl: string;

  readonly auth = this._auth.asReadonly();
  readonly authenticated = computed(() => this.auth() === AuthState.Authenticated);

  // Legacy Observable API, update callers to use signals
  readonly auth$ = toObservable(this.auth).pipe(distinctUntilChanged());

  public redirectUrl?: string;

  constructor() {
    this.logger.debug('AuthService constructor');
    this.apiUrl = inject(GlobalsService).getApiUrl();
  }

  setAuth(res: any) {
    this._accessToken = res.access_token;
    this._credentials = new Credentials(res.credentials);
    if (!this.authenticated()) {
      this._auth.set(AuthState.Authenticated);
      this.logger.debug('AuthService: Authenticated');
    } else {
      this.logger.debug(`AuthService: Updating Auth access token and credentials.`);
    }
  }

  get accessToken(): string | null {
    return this._accessToken;
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
        `Checking access token. Not Expired. Issued ${new Date(payload.iat * 1000).toLocaleString()} ` +
          `Expires at: ${new Date(exp).toLocaleString()} ` +
          `Has ${(exp - now) / 1000} seconds left`,
      );
      return false;
    } else {
      this.logger.info(
        `Checking access token. Expired. Issued ${new Date(payload.iat * 1000).toLocaleString()} ` +
          `Expired at: ${new Date(exp).toLocaleString()} ` +
          `${Math.floor((now - exp) / 1000)} seconds ago`,
      );
      return true;
    }
  }

  /**
   * Get the current authenticated state for the service.
   */
  get state(): AuthState {
    return this.auth();
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
   * @deprecated Use `authenticated()` computed signal instead
   */
  checkAuthenticated(): Promise<boolean> {
    this.logger.debug('AuthService.checkAuthenticated called');
    return Promise.resolve(this.authenticated());
  }

  /** Remove all the login info associated with this user */
  async logout(): Promise<void> {
    // Snapshot mutable auth state so async work uses consistent values
    const token = this.accessToken;
    const credentials = this.credentials;

    if (!token) {
      this.clearSession();
      return;
    }

    this.logger.debug(`AuthService; logging out ${credentials?.username}`);

    try {
      const response = await firstValueFrom(
        this.http.post(
          `${this.apiUrl}auth/logout`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          },
        ),
      );

      this.logger.debug('AuthService: logout response from server', response);
    } catch (error: any) {
      if (error.status !== 401) {
        this.logger.error('Error logging out user', error);
      }
    } finally {
      this.clearSession();
    }
  }

  private clearSession(): void {
    this._credentials = null;
    this._accessToken = null;
    this._auth.set(AuthState.Unauthenticated);
  }
}
