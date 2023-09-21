import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';
import { Credentials } from '@models/credentials';
import { Trip } from '@models/trip';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { StorageService } from '@services/storage/storage.service';
import { TripSwitcherService } from '@services/trip-switcher/trip-switcher.service';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private TRIP_DATA_STORAGE_KEY = 'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA';
  private _tripName$: BehaviorSubject<string> = new BehaviorSubject('');
  private _trip: Trip | null = null;
  id!: number;
  name!: string;
  code!: string;
  type!: string;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private storageService: StorageService,
    private logger: NGXLogger,
    private translate: TranslateService,
    private tripSwitcherService: TripSwitcherService
  ) {
    this.init();
  }

  get tripName$() {
    return this._tripName$;
  }

  get trip(): Trip | null {
    return this._trip;
  }

  init() {
    this.logger.debug('TripService::init()');
    // Subscribe to authentication updates.
    this.auth.auth$.subscribe((authStatus: boolean) => {
      this.handleAuthStatusChange(authStatus);
    });
  }

  /**
   * Handle changes to the application authentication service status, could be
   * a login or a logout.
   * @param authStatus boolean
   */
  private handleAuthStatusChange(authStatus: boolean) {
    this.logger.debug(`Updated authentication status ${authStatus}`);
    if (!authStatus) {
      this.clear();
    } else {
      if (this.auth.isStudent || this.auth.isTeacher) {
        // If we received auth$ true we should have credentials.
        const cred: Credentials | undefined = this.auth.getCredentials();
        if (cred) {
          this.fetch(cred);
        } else {
          this.logger.warn('Expected credentials to exists and be valid');
        }
      } else {
        this.logger.debug(
          'Detected school admin user, subscribing to TripSwitcher updates'
        );
        this.tripSwitcherService.selectedTrip$.subscribe((trip) =>
          this.setTrip(trip)
        );
      }
    }
  }

  /**
   * Clear the data for this service.
   */
  clear() {
    this.logger.debug('TripService::clear()');
    this._trip = null;
    this._tripName$.next('');
    this.storageService.remove(this.TRIP_DATA_STORAGE_KEY);
  }

  /**
   * Set the trip data.
   * @param tripData any
   */
  private setTrip(trip: Trip): void {
    this._trip = trip;
    this.storageService.set(this.TRIP_DATA_STORAGE_KEY, trip);
    this._tripName$.next(trip.getName(this.translate.currentLang));
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

  /**
   * Fetch trip data from the API.
   * @param cred Credentials The authenticated user credentials to fetch for.
   */
  private fetch(cred: Credentials): void {
    this.logger.debug('TripService fetching from API');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + (cred.accessToken || ''),
      }),
    };
    this.api.get('my-trip', { expand: 'name_zh,name_en' }, options).subscribe({
      next: (res: any) => {
        this.setTrip(new Trip(res));
      },

      error: (err: any) => {
        this.logger.warn('Error fetching my trip', err);
      },
    });
  }
}
