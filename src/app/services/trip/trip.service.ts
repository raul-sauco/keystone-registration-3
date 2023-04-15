import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

import { Credentials } from '@models/credentials';
import { Trip } from '@models/trip';
import { AuthService } from '@services/auth/auth.service';
import { StorageService } from '@services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private TRIP_DATA_STORAGE_KEY = 'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA';
  public tripName$: BehaviorSubject<string> = new BehaviorSubject('');
  id!: number;
  name!: string;
  code!: string;
  type!: string;

  constructor(
    private auth: AuthService,
    private storageService: StorageService,
    private logger: NGXLogger,
    private translate: TranslateService
  ) {
    this.init();
  }

  init() {
    this.logger.debug('TripService::init()');
    // Subscribe to authentication updates.
    this.auth.auth$.subscribe((authStatus: boolean) => {
      this.logger.debug(`Updated authentication status ${authStatus}`);
      if (!authStatus) {
        this.clear();
      } else {
        if (this.auth.isStudent || this.auth.isTeacher) {
          // If we received auth$ true we should have credentials.
          const cred: Credentials = this.auth.getCredentials()!;
        } else {
          // TODO: Subscribe to updates to TripSwitcher service when
          // school admins select a trip.
        }
      }
    });
  }

  /**
   * Clear the data for this service.
   */
  clear() {
    this.logger.debug('TripService::clear()');
    this.tripName$.next('');
    this.storageService.remove(this.TRIP_DATA_STORAGE_KEY);
  }

  /**
   * Set the trip data.
   * @param tripData any
   */
  setTrip(tripData: any): void {
    const trip = new Trip(tripData);
    this.storageService.set(this.TRIP_DATA_STORAGE_KEY, trip);
    this.tripName$.next(trip.getName(this.translate.currentLang));
  }

  /**
   * Init the providers values with a server's response
   * data = {
   *   code: code,
   *   error: false,
   *   type: 'student' | 'teacher'
   *   id: 143,
   *   name: 'Hogwarts school of witchcraft...'
   * }
   * @param data whether the values could be used to set
   * the provider
   */
  setCodeValues(data: any): boolean {
    this.id = data.id;
    this.name = data.name;
    this.code = data.code;
    this.type = data.type;
    // todo check if values can be used
    return true;
  }
}
