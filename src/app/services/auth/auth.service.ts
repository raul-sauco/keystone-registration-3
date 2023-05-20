import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { Credentials } from 'src/app/models/credentials';
import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private credentials?: Credentials;

  public authenticated = false;
  auth$: Subject<boolean> = new Subject<boolean>();
  public redirectUrl?: string;

  constructor(private storage: StorageService, private logger: NGXLogger) {
    this.logger.debug('AuthService constructor');
    this.checkAuthenticated().catch((error) => this.logger.warn(error));
  }

  /** Set the auth credentials */
  setCredentials(cred: Credentials) {
    this.credentials = cred;
    this.authenticated = true;
    this.auth$.next(this.authenticated);
    return this.saveCredentials();
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

  /** Save the current credentials to persistent storage */
  saveCredentials(): Promise<any> {
    this.logger.debug('AuthService; saving credentials to storage');
    const credString = this.credentials;
    return this.storage.set(this.storage.keys.credentials, credString);
  }

  /** Checks whether the application has a user currently authenticated */
  checkAuthenticated(): Promise<boolean> {
    this.logger.debug('AuthService.checkAuthenticated called');
    return new Promise<boolean>((resolve, reject) => {
      // Quick resolve
      if (this.authenticated) {
        resolve(true);
      }
      if (this.credentials?.accessToken) {
        this.logger.debug(
          'AuthService.checkAuthenticated(); had credentials: ',
          this.credentials
        );
        this.authenticated = true;
        this.auth$.next(this.authenticated);
        resolve(true);
      } else {
        this.logger.debug(
          'AuthService.checkAuthenticated(); did not have credentials, checking storage'
        );
        this.storage
          .get(this.storage.keys.credentials)
          .then((cred) => {
            if (cred) {
              this.logger.debug(
                'AuthService.checkAuthenticated(); got credentials from StorageService',
                cred
              );
              // Try parsing the credentials.
              try {
                this.credentials = new Credentials(cred);
                this.authenticated = true;
                this.auth$.next(this.authenticated);
                resolve(true);
              } catch (e) {
                this.logger.warn(
                  'AuthService.checkAuthenticated(); Failed to parse credentials',
                  e,
                  cred
                );
              }
              // Fail if we cannot create a Credentials object.
              resolve(false);
            } else {
              this.logger.debug(
                'AuthService.checkAuthenticated(); did not get credentials from StorageService'
              );
              resolve(false);
            }
          })
          .catch((error) => {
            this.logger.warn(
              'AuthService.checkAuthenticated(); Error getting credentials from storage',
              error
            );
            reject(error);
          });
      }
    });
  }

  /** Remove all the login info associated with this user */
  logout(): Promise<any> {
    if (this.credentials) {
      this.logger.debug(
        `AuthService; logging out ${this.credentials.username}`
      );
    }
    this.credentials = undefined;
    this.authenticated = false;
    this.auth$.next(this.authenticated);
    // When the user logs out, we want to remove all of its data.
    return this.storage.removeAll();
  }
}
