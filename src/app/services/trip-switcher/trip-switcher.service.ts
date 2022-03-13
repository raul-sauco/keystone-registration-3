import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ReplaySubject, Subject } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';

@Injectable({
  providedIn: 'root',
})
export class TripSwitcherService {
  private trips: Trip[] = [];
  trips$: Subject<Trip[]> = new ReplaySubject();
  selectedTrip$: Subject<Trip> = new ReplaySubject();
  selectedTrip: Trip | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private routeStateService: RouteStateService
  ) {
    this.logger.debug('TripSwitcherService constructor');
    this.init();
  }

  /**
   * Check if we have auth information and the user is a School Admin.
   * If yes to all, fetch trip information.
   */
  init(): void {
    this.auth.checkAuthenticated().then((res) => {
      if (res && this.auth.isSchoolAdmin) {
        this.refreshTrips();
      }
    });
  }

  /**
   * Fetch trips from the backend.
   */
  refreshTrips(): void {
    this.logger.debug('TripSwitcherService fetching trips');
    const endpoint = 'trips?expand=name_en,name_zh';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.api.get(endpoint, null, options).subscribe({
      next: (tripsJson: any) => {
        this.logger.debug(
          'TripSwitcherService got trips json from server',
          tripsJson
        );
        tripsJson.forEach((t: any) => {
          this.trips.push(new Trip(t));
        });
        this.trips$.next(this.trips);
      },
    });
  }

  /**
   * Update the currently selected trip.
   * @param id the trip id
   * @returns
   */
  selectTrip(id: number): boolean {
    this.logger.debug(`TripSwitcher Service selecting trip ${id}`);
    const trip = this.trips.find((t) => t.id === id);
    if (!trip) {
      this.logger.warn(
        `Tried selecting trip ${id} - not found in service's trip array`
      );
      return false;
    }
    this.selectedTrip = trip;
    this.selectedTrip$.next(trip);
    this.routeStateService.updateTripIdParamState(`${trip.id}`);
    return true;
  }

  /**
   * Remove all existing component data.
   */
  async logout() {
    this.logger.debug('TripSwitcherService logging out');
    this.trips = [];
    this.selectedTrip = null;
  }
}
