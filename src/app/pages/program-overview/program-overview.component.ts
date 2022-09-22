import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-program-overview',
  templateUrl: './program-overview.component.html',
  styleUrls: ['./program-overview.component.scss'],
})
export class ProgramOverviewComponent implements OnInit {
  document$: Observable<any> | null = null;
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

  ngOnInit(): void {
    this.logger.debug('ProgramOverviewComponent OnInit');
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        // If we have a routing parameter, update the route state and fetch data
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
        this.fetchPdfData(tripId);
      } else {
        // No trip id router parameter
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res) {
            if (this.auth.isSchoolAdmin) {
              if (this.tripSwitcher.selectedTrip) {
                this.fetchPdfData(`${this.tripSwitcher.selectedTrip.id}`);
              } else {
                this.document$ = of([]);
              }
            } else {
              this.fetchPdfData();
            }
          } else {
            // We are not fetching anything, inform the user
            this.needsLogin = true;
          }
        });
      }
    });
  }

  fetchPdfData(tripId?: string): void {
    const endpoint =
      'files?tagged=itinerary' + (tripId ? `&trip-id=${tripId}` : '');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.auth.getCredentials()?.accessToken) {
      headers = headers.append(
        'Authorization',
        `Bearer ${this.auth.getCredentials()?.accessToken}`
      );
    }
    const options = { headers };
    this.document$ = this.api.get(endpoint, null, options);
  }
}
