import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * A private map of keys that the storage service uses.
   * Previously the callers stored the keys, having the storage service
   * store the keys and making them accessible through a getter we can
   * improve the reusability while making the storage service aware of
   * all the keys that can be used.
   * @since 1.0.2
   */
  private _keys: { [key: string]: string } = {
    credentials: 'KEYSTONE_ADVENTURES_CREDENTIALS_STORAGE_KEY',
    currentTrip: 'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA',
    paymentInfo: 'KEYSTONE_ADVENTURES_PAYMENT_INFO_STORAGE_KEY',
    schoolService: 'KEYSTONE_ADVENTURES_SCHOOL_SERVICE_STORAGE_KEY',
  };

  constructor(private logger: NGXLogger) {
    this.logger.debug('StorageService constructor');
  }

  /**
   * TODO upgrade to use different types of storage.
   *
   * Get the value for a given key
   * @param key the key the value is indexed by
   * @returns Returns a promise that resolves to the parsed value associated with the key
   */
  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageAvailable('localStorage')) {
        const storageValue = localStorage.getItem(key);
        if (storageValue === null) {
          const msg = `No storage entry found for ${key}`;
          this.logger.debug(msg);
          resolve(null);
        }
        const stringValue = storageValue as string;
        this.logger.debug(
          `StorageService found value for ${key}: ${stringValue}`
        );
        resolve(JSON.parse(stringValue));
      } else {
        this.logger.warn(
          'StorageService.get() warning; localStorage not available in platform'
        );
        reject({
          error: true,
          msg: 'localStorage not available in browser',
        });
      }
    });
  }

  /** `keys` property getter. */
  get keys() {
    return this._keys;
  }

  /**
   * TODO temporarily use local storage, improve later checking for
   * different types of storage and using the best available.
   *
   * Set the value for the given key.
   * @param key the key to identify this value
   * @param value the value to store for this key
   * @returns Returns a promise that resolves when the key and value are set
   */
  set(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.storageAvailable('localStorage')) {
        const stringValue = JSON.stringify(value);
        try {
          localStorage.setItem(key, stringValue);
        } catch (e: any) {
          this.logger.warn(
            'StorageService.set() warning; localStorage error setting value',
            e
          );
          reject({
            error: true,
            msg: e.message,
            code: e.code,
            name: e.name,
          });
        }
        this.logger.debug(`StorageService; set ${key}: ${stringValue}`);
        resolve(true);
      } else {
        this.logger.warn(
          'StorageService.set() warning; localStorage not available in platform'
        );
        reject({
          error: true,
          msg: 'localStorage not available in browser',
        });
      }
    });
  }

  /**
   * TODO upgrade to use different types of storage.
   * TODO: subscribe to auth status changes and remove
   * everything from storage in logout.
   *
   * Remove the key => value pair from storage
   * @param key the key the value is indexed by
   * @returns Returns a promise that resolves when the value is removed
   */
  remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.storageAvailable('localStorage')) {
        this.logger.debug(`StorageService; removing ${key}`);
        resolve(localStorage.removeItem(key));
      } else {
        this.logger.warn(
          'StorageService.remove() warning; localStorage not available in platform'
        );
        reject({
          error: true,
          msg: 'localStorage not available in browser',
        });
      }
    });
  }

  /**
   * Clear all the data found in storage.
   * @returns `true` if it can remove all the data from storage, `false` otherwise.
   */
  async removeAll(): Promise<boolean> {
    let count = 0;
    try {
      for (const key in this.keys) {
        await this.remove(this.keys[key]);
        count++;
      }
    } catch (e) {
      this.logger.warn('StorageService.removeAll() failed', e);
      return false;
    }
    this.logger.debug(`StorageService removed ${count} keys from storage`);
    return true;
  }

  /**
   * Check availability of WebStorage
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
   *
   * @param string type localStorage, cacheStorage, sessionStorage type browser storage.
   */
  storageAvailable(type: string): boolean {
    let storage: any;
    try {
      storage = (window as { [key: string]: any })[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      this.logger.warn(
        `StorageService: Storage type: "${type}" is not available`
      );
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
}
