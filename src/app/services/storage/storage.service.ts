import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * TODO upgrade to use different types of storage.
   *
   * Get the value for a given key
   * @param key the key the value is indexed by
   * @returns Returns a promise that resolves to the value found or null
   */
  get(key: string): Promise<any> {

    return new Promise( (resolve, reject) => {

      if (this.storageAvailable(localStorage)) {

        resolve(localStorage.getItem(key));

      } else {

        reject({
          error: true,
          msg: 'localStorage not available in browser'
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
   * @param value the value for this key
   * @returns Returns a promise that resolves when the key and value are set
   */
  set(key: string, value: any): Promise<any> {

    return new Promise( (resolve, reject) => {

      if (this.storageAvailable(localStorage)) {

        localStorage.setItem(key, value);
        try {
          localStorage.setItem(key, value);
        } catch (e) {

          console.error(e);
          reject({
            error: true,
            msg: e.message,
            code: e.code,
            name: e.name
          });
        }

        resolve(true);

      } else {

        reject({
          error: true,
          msg: 'localStorage not available in browser'
        });

      }
    });

  }

  /**
   * TODO upgrade to use different types of storage.
   *
   * Remove the key => value pair from storage
   * @param key the key the value is indexed by
   * @returns Returns a promise that resolves when the value is removed
   */
  remove(key: string): Promise<any> {

    return new Promise( (resolve, reject) => {

      if (this.storageAvailable(localStorage)) {

        resolve(localStorage.removeItem(key));

      } else {

        reject({
          error: true,
          msg: 'localStorage not available in browser'
        });

      }

    });
  }

  /**
   * Check availability of WebStorage
   * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
   *
   * @param type
   */
  storageAvailable(type) {

    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }

  }
}
