import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class RouteStateService {

  // Make the BehaviorSubject private to hide the next() method
  private tripIdParamState = new BehaviorSubject<string>(null);

  // Expose tripId as an observable
  tripIdParam$: Observable<string>;

  constructor(private logger: NGXLogger) {
    this.logger.trace('Instantiated RouteStateService');
    this.tripIdParam$ = this.tripIdParamState.asObservable();
  }

  /**
   * Routed components will use this method to update the service value.
   * @param string tripId the new value of the trip Id route parameter
   */
  updateTripIdParamState(tripId: string) {
    this.logger.debug(`RouteStateService; updated tripIdParam to ${tripId}`);
    this.tripIdParamState.next(tripId);
  }
}
