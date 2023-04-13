import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
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
