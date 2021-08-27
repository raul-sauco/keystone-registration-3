import { Injectable } from '@angular/core';
import { Credentials } from '../../models/credentials';
import { StorageService } from '../storage/storage.service';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private CREDENTIALS_STORAGE_KEY =
    'KEYSTONE_ADVENTURES_CREDENTIALS_STORAGE_KEY';
  private credentials: Credentials = null;

  public authenticated = false;
  auth$: Subject<boolean> = new Subject<boolean>();
  public redirectUrl: string;

  constructor(private storage: StorageService, private logger: NGXLogger) {
    this.logger.debug('AuthService constructor');
    this.checkAuthenticated();
  }

  /** Set the auth credentials */
  setCredentials(cred: Credentials) {
    this.credentials = cred;
    this.authenticated = true;
    this.auth$.next(this.authenticated);
    return this.saveCredentials();
  }

  /** Return the current credentials if any, null otherwise */
  getCredentials(): Credentials {
    return this.credentials ? this.credentials : null;
  }

  /** Save the current credentials to persistent storage */
  saveCredentials(): Promise<any> {
    this.logger.debug('AuthService; saving credentials to storage');
    const credString = this.credentials;
    return this.storage.set(this.CREDENTIALS_STORAGE_KEY, credString);
  }

  /** Checks whether the application has a user currently authenticated */
  checkAuthenticated(): Promise<boolean> {
    this.logger.debug('AuthService.checkAuthenticated called');
    return new Promise<boolean>((resolve, reject) => {
      // Quick resolve
      if (this.authenticated) {
        resolve(true);
      }
      if (this.credentials !== null && this.credentials.accessToken !== null) {
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
          .get(this.CREDENTIALS_STORAGE_KEY)
          .then((cred) => {
            if (cred) {
              this.logger.debug(
                'AuthService.checkAuthenticated(); got credentials from StorageService',
                cred
              );
              this.credentials = new Credentials(cred);
              this.authenticated = true;
              this.auth$.next(this.authenticated);
              resolve(true);
            } else {
              this.logger.debug(
                'AuthService.checkAuthenticated(); did not get credentials from StorageService',
                cred
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
    this.logger.debug(`AuthService; logging out ${this.credentials.userName}`);
    this.credentials = null;
    this.authenticated = false;
    this.auth$.next(this.authenticated);
    return this.storage.remove(this.CREDENTIALS_STORAGE_KEY);
  }
}
