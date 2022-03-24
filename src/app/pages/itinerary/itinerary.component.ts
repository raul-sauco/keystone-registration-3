import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ItineraryComponent implements OnInit {
  itineraries$: Observable<any> | null = null;
  url: string;
  lang: string;
  needsLogin = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private globals: GlobalsService,
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private routeStateService: RouteStateService,
    private translate: TranslateService,
    private tripSwitcher: TripSwitcherService
  ) {
    this.url = this.globals.getResUrl();
    this.lang = this.translate.currentLang;
  }

  /**
   * Try to get an optional trip-id parameter and have the
   * activity group service fetch activity groups for the
   * component.
   *
   * If the component didn't get the parameter, the backend
   * will try to authenticate the user and return activity
   * groups for the trip they are a participant on.
   */
  ngOnInit() {
    this.logger.debug('ItineraryComponent OnInit');
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        // If we have a routing parameter, update the route state and fetch data
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
        this.fetch(tripId);
      } else {
        // No trip id router parameter
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res) {
            if (this.auth.isSchoolAdmin) {
              if (this.tripSwitcher.selectedTrip) {
                this.fetch(`${this.tripSwitcher.selectedTrip.id}`);
              } else {
                this.itineraries$ = of([]);
              }
            } else {
              this.fetch();
            }
          } else {
            // We are not fetching anything, inform the user
            this.needsLogin = true;
          }
        });
      }
    });
  }

  fetch(tripId?: string): void {
    const endpoint =
      'files?tagged=itinerary' + (tripId ? `&trip-id=${tripId}` : '');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.itineraries$ = this.api.get(endpoint, null, options);
  }
}
