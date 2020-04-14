import { Injectable } from '@angular/core';
import { Credentials } from '../../models/credentials';
import { StorageService } from '../storage/storage.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private CREDENTIALS_STORAGE_KEY = 'KEYSTONE_ADVENTURES_CREDENTIALS_STORAGE_KEY';
  private credentials: Credentials = null;

  public authenticated = false;
  auth$: Subject<boolean> = new Subject<boolean>();
  public redirectUrl: string;

  constructor(private storage: StorageService) {
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
    return this.credentials !== null ? this.credentials : null;
  }

  /** Save the current credentials to persistent storage */
  saveCredentials(): Promise<any> {
    return this.storage.set(this.CREDENTIALS_STORAGE_KEY, this.credentials);
  }

  /** Checks whether the application has a user currently authenticated */
  checkAuthenticated(): Promise<boolean> {

    return new Promise<boolean>(
      ((resolve, reject) => {

        if (this.credentials !== null && this.credentials.accessToken !== null) {
          this.authenticated = true;
          this.auth$.next(this.authenticated);
          resolve(true);
        } else {

          this.storage.get(this.CREDENTIALS_STORAGE_KEY).then(
            credentials => {
              if (credentials) {
                this.credentials = credentials;
                this.authenticated = true;
                this.auth$.next(this.authenticated);
                resolve(true);
              } else {
                resolve(false);
              }
            }
          ).catch(error => reject(error));
        }
      })
    );
  }

  /** Remove all the login info associated with this user */
  logout(): Promise<any> {
    this.credentials = null;
    this.authenticated = false;
    return this.storage.remove(this.CREDENTIALS_STORAGE_KEY);
  }
}
