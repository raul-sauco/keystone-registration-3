import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Guide } from '@models/guide';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';
import { RouteStateService } from '@services/route-state/route-state.service';
import { TripSwitcherService } from '@services/trip-switcher/trip-switcher.service';
import { TripService } from '@services/trip/trip.service';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss'],
})
export class GuidesComponent implements OnInit {
  guide$: Observable<Guide[]> = of([]);
  url: string;
  lang: string;
  needsLogin = false;
  displayStaffingNotConfirmedTemplate = true;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private route: ActivatedRoute,
    private routeStateService: RouteStateService,
    private logger: NGXLogger,
    private translate: TranslateService,
    private tripSwitcher: TripSwitcherService,
    private tripService: TripService,
    globals: GlobalsService
  ) {
    this.url = globals.getResUrl();
    this.lang = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.logger.debug('GuidesComponent OnInit');
    const headers: any = { 'Content-Type': 'application/json' };
    this.route.paramMap.subscribe((params: ParamMap) => {
      // const tripId = params.get('trip-id');
      const trip = this.tripService.trip;
      if (trip !== null) {
        if (trip.isStaffingConfirmed) {
          this.logger.debug(
            `Trip ${trip.id} staffing confirmed, fetching staff information`
          );
          this.displayStaffingNotConfirmedTemplate = false;
          this.fetch({ 'trip-id': trip.id }, headers);
        } else {
          // Fetch template content.
        }
      } else {
        // If we don't have a trip id parameter, request for the current user
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res && this.auth.getCredentials()?.accessToken) {
            if (this.auth.isSchoolAdmin) {
              if (this.tripSwitcher.selectedTrip) {
                this.fetch(
                  { 'trip-id': this.tripSwitcher.selectedTrip.id },
                  headers
                );
              } else {
                this.guide$ = of([]);
              }
            } else {
              headers.authorization = `Bearer ${
                this.auth.getCredentials()?.accessToken
              }`;
              this.fetch(null, headers);
            }
          } else {
            this.needsLogin = true;
          }
        });
      }
    });
  }

  /**
   * Have the ApiService make a request for guides and
   * subscribe to the result.
   * The request supports authenticated and trip-id trip
   * resolution.
   * @param params parameters to be sent on the request
   * @param headers to be added to the options object
   */
  fetch(params: any, headers: any): void {
    const endpoint = 'guides';
    const options = {
      headers: new HttpHeaders(headers),
    };
    this.guide$ = this.api.get(endpoint, params, options).pipe(
      map((res: any) => {
        // Sort the guides and map them to Guide models
        return res
          .sort((a: any, b: any) => a.nickname.localeCompare(b.nickname))
          .map((guideJSON: any) => new Guide(guideJSON));
      })
    );
  }
}
