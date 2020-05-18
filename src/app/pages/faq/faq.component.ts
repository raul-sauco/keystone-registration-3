import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Faq } from 'src/app/models/faq';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiService } from 'src/app/services/api/api.service';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faq$: Observable<Faq[]>;
  needsLogin = false;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private logger: NGXLogger,
    private routeStateService: RouteStateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.logger.debug('FaqComponent OnInit');
    const headers: any = {'Content-Type': 'application/json'};
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        this.routeStateService.tripIdParam$.subscribe((id: string) => {
          if (tripId !== id) {
            this.routeStateService.updateTripIdParamState(tripId);
          }
        });

        // TODO get trip id from auth user
        this.fetch({'trip-id': tripId}, headers);
      } else {
        // No trip id parameter, try to find an user
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
   * Have the ApiService request faqs for the current user's
   * trip or based on an optional trip id parameter.
   * @param params optional parameters to send with the request
   * @param headers headers to add to the http options object
   */
  fetch(params: any, headers: any): void {
    const endpoint = 'trip-questions';
    const options = {
      headers: new HttpHeaders(headers)
    };
    this.faq$ = this.api.get(endpoint, params, options).pipe(
      map((faqjson: any) => {

        // Sort the guides and map them to Guide models
        return faqjson.sort(
            (a: any, b: any) => a.updated_at - b.updated_at
          ).map((faq: any) => new Faq(faq) );

      })
    );
  }

}
