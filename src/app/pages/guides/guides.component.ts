import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { GlobalsService } from 'src/app/local/globals.service';
import { TranslateService } from '@ngx-translate/core';
import { Guide } from 'src/app/models/guide';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiService } from 'src/app/services/api/api.service';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss']
})
export class GuidesComponent implements OnInit {

  guide$: Observable<Guide[]>;
  url: string;
  lang: string;
  needsLogin = false;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private route: ActivatedRoute,
    private routeStateService: RouteStateService,
    private logger: NGXLogger,
    private translate: TranslateService,
    globals: GlobalsService
  ) {
    this.url = globals.getResUrl();
    this.lang = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.logger.debug('GuidesComponent OnInit');
    const headers: any = {'Content-Type': 'application/json'};
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        this.routeStateService.tripIdParam$.subscribe((id: string) => {
          if (tripId !== id) {
            this.routeStateService.updateTripIdParamState(tripId);
          }
        });
        // If we have a trip id request info for that trip
        this.fetch({'trip-id': tripId}, headers);
      } else {
        // If we don't have a trip id parameter, request for the current user
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res && this.auth.getCredentials().accessToken) {
            headers.authorization = `Bearer ${this.auth.getCredentials().accessToken}`;
            this.fetch(null, headers);
            // this.guide$ = this.guideService.fetchGuides();
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
      headers: new HttpHeaders(headers)
    };
    this.guide$ = this.api.get(endpoint, params, options).pipe(
      map((res: any) => {
        // Sort the guides and map them to Guide models
        return res.sort(
            (a: any, b: any) => a.nickname.localeCompare(b.nickname)
          ).map(guideJSON => new Guide(guideJSON) );
      })
    );
  }
}
