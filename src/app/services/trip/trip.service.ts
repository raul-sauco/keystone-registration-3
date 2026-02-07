import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

import { Trip } from '@models/trip';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { StorageService } from '@services/storage/storage.service';
import { AuthState } from '@models/auth-state';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private storageService = inject(StorageService);
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);

  private TRIP_DATA_STORAGE_KEY = 'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA';
  private _tripName$: BehaviorSubject<string> = new BehaviorSubject('');
  private _trip: Trip | null = null;
  id!: number;
  name!: string;
  code!: string;
  type!: string;

  // TODO: Stop initializing the service from the constructor, have a caller
  // for example AppComponent, call its fetch method when required.
  constructor() {
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
    this.auth.auth$.subscribe((authState: AuthState) => {
      this.handleAuthStatusChange(authState);
    });
    this.translate.onLangChange.subscribe(() =>
      this._tripName$.next(this._trip?.getName(this.translate.getCurrentLang()) ?? ''),
    );
  }

  /**
   * Handle changes to the application authentication service status, could be
   * a login or a logout.
   * @param authState boolean
   */
  private handleAuthStatusChange(authState: AuthState) {
    this.logger.debug(`Updated authentication status ${authState}`);
    if (authState === AuthState.Authenticated) {
      this.fetch();
    } else {
      this.clear();
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
    this._tripName$.next(trip.getName(this.translate.getCurrentLang()));
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
   */
  private fetch(): void {
    this.logger.debug('TripService fetching from API');
    this.api.get('my-trip', { expand: 'name_zh,name_en' }).subscribe({
      next: (res: any) => {
        this.setTrip(new Trip(res));
      },
      error: (err: any) => {
        this.logger.warn('Error fetching my trip', err);
      },
    });
  }
}
