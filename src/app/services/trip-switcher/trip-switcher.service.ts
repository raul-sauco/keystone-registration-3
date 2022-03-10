import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ReplaySubject, Subject } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TripSwitcherService {
  private trips: Trip[] = [];
  trips$: Subject<Trip[]> = new ReplaySubject();
  private selectedTrip: Trip | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger
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
      if (res && this.auth.getCredentials()?.type === 8) {
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
}
