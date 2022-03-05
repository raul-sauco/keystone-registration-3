import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class RouteStateService {
  // Make the BehaviorSubject private to hide the next() method
  private tripIdParamState = new BehaviorSubject<string | null>(null);
  // Store the last value assigned to tripId
  private tripId: string | null;

  // Expose tripId as an observable
  tripIdParam$: Observable<string | null>;

  constructor(private logger: NGXLogger, private auth: AuthService) {
    this.logger.trace('Instantiated RouteStateService');
    this.tripId = null;
    this.tripIdParam$ = this.tripIdParamState.asObservable();
  }

  /**
   * Set the trip id value to null.
   */
  setNullTripIdParamState() {
    this.logger.debug(`RouteStateService; setting tripIdParam to null`);
    this.tripId = null;
    this.tripIdParamState.next(this.tripId);
  }

  /**
   * Routed components will use this method to update the service value.
   * The method only works if we do not have an authenticated user.
   * @param tripId tripId the new value of the trip Id route parameter
   */
  updateTripIdParamState(tripId: string) {
    this.logger.debug(`RouteStateService; updated tripIdParam to ${tripId}`);
    this.tripId = tripId;
    this.tripIdParamState.next(tripId);
  }

  /**
   * Sync get the last value assigned to trip ID.
   */
  getTripId(): string | null {
    return this.tripId;
  }
}
