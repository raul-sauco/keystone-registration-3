import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NGXLogger } from 'ngx-logger';
import { distinctUntilChanged, firstValueFrom } from 'rxjs';

import { AuthState } from '@models/auth-state';
import { Credentials, CredentialsJson, UserType } from '@models/credentials';
import { GlobalsService } from '@services/globals/globals.service';

interface AuthCheckResponseJson {
  error: boolean;
  message: string;
  credentials: CredentialsJson;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logger = inject(NGXLogger);
  private http = inject(HttpClient);
  private globals = inject(GlobalsService);

  private readonly apiUrl = this.globals.getApiUrl();

  // Private state
  private readonly _state = signal<AuthState>(AuthState.Unknown);
  // Use the `signal` prefix while we keep the old getters
  private readonly _credentials = signal<Credentials | null>(null);
  private readonly _accessToken = signal<string | null>(null);

  // Public signals
  readonly initialized = signal(false);

  readonly state = this._state.asReadonly();
  readonly credentialsSignal = this._credentials.asReadonly();
  readonly accessTokenSignal = this._accessToken.asReadonly();

  readonly authenticated = computed(() => this.state() === AuthState.Authenticated);
  readonly isTeacherSignal = computed(() => this.credentialsSignal()?.type == UserType.Teacher);
  readonly isStudentSignal = computed(() => this.credentialsSignal()?.type == UserType.Student);

  /** @deprecated update to signals */
  readonly auth$ = toObservable(this.state).pipe(distinctUntilChanged());

  public redirectUrl?: string;

  async initialize(): Promise<void> {
    this.logger.debug('AuthService::initialize called');

    try {
      const response = await firstValueFrom(
        this.http.get<AuthCheckResponseJson>(`${this.apiUrl}auth/check`, {
          withCredentials: true,
        }),
      );
      this.logger.debug('AuthService::initialize got response from auth/check', response);

      if (response) {
        this.setCredentials(response);
      } else {
        this._state.set(AuthState.Unauthenticated);
      }
    } catch (err: any) {
      this.logger.info('AuthService::initialize Could not authenticate a User');
      if (err.status !== 401) {
        this.logger.error(err);
      }

      this._state.set(AuthState.Unauthenticated);
    } finally {
      this.initialized.set(true);
    }
  }

  setAccessToken(access_token: string) {
    this._accessToken.set(access_token);
  }

  /**
   * This method is public because it is called from different components that handle
   * different ways to authenticate. Register, Login and ResetPassword.
   *
   * It is also used by the initialize method.
   */
  setCredentials(res: AuthCheckResponseJson) {
    this.logger.trace('AuthService::setCredentials called', res);
    this._credentials.set(new Credentials(res.credentials));
    if (!this.authenticated()) {
      this._state.set(AuthState.Authenticated);
      this.logger.debug('AuthService: Authenticated');
    } else {
      this.logger.debug(`AuthService: Updating Auth access token and credentials.`);
    }
  }

  /** @deprecated Use `auth.accessTokenSignal()` instead */
  get accessToken(): string | null {
    return this.accessTokenSignal();
  }

  /** @deprecated Use `auth.credentialsSignal()` instead */
  get credentials(): Credentials | null {
    return this.credentialsSignal();
  }

  /** @deprecated Use `auth.isTeacherSignal()` instead */
  get isTeacher(): boolean {
    return this.isTeacherSignal();
  }

  /** @deprecated Use `auth.isStudentSignal()` instead */
  get isStudent(): boolean {
    return this.isStudentSignal();
  }

  /** @deprecated Removing SchoolAdminAccess, updating to sample accounts */
  get isSchoolAdmin(): boolean {
    return this.credentialsSignal()?.type === 8;
  }

  /** @deprecated Use `auth.credentialsSignal()` instead */
  getCredentials(): Credentials | null {
    return this.credentialsSignal();
  }

  /** @deprecated Use `auth.accessTokenSignal()` instead */
  getAccessToken(): string | null {
    return this.accessTokenSignal();
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
    const token = this.accessTokenSignal();
    const credentials = this.credentialsSignal();

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

      this.logger.debug('AuthService: logout response', response);
    } catch (error: any) {
      if (error.status !== 401) {
        this.logger.error('Error logging out user', error);
      }
    } finally {
      this.clearSession();
    }
  }

  private clearSession(): void {
    this._credentials.set(null);
    this._accessToken.set(null);
    this._state.set(AuthState.Unauthenticated);
  }
}
