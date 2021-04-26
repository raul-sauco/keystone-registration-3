import { RouteStateService } from './../../services/route-state/route-state.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

import { ApiService } from './../../services/api/api.service';
import { AuthService } from './../../services/auth/auth.service';
import { Supplier } from './../../models/supplier';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss'],
})
export class AccommodationComponent implements OnInit {
  supplier$: Observable<Supplier>;
  needsLogin = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private routeStateService: RouteStateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('AccommodationComponent OnInit');
    const headers: any = { 'Content-Type': 'application/json' };
    let requestParams: any = { expand: 'images' };
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        // If we have a routing parameter, update the route state and fetch data
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
        // If we have a trip id request info for that trip
        requestParams['trip-id'] = tripId;
        this.fetch(requestParams, headers);
      } else {
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res && this.auth.getCredentials().accessToken) {
            headers.authorization = `Bearer ${
              this.auth.getCredentials().accessToken
            }`;
            this.fetch(params, headers);
          } else {
            this.needsLogin = true;
          }
        });
      }
    });
  }

  /**
   * Fetch accommodation info from the backend.
   */
  fetch(params: any, headers: any): void {
    const endpoint = 'accommodation';
    const options = {
      headers: new HttpHeaders(headers),
    };
    this.supplier$ = this.api
      .get(endpoint, params, options)
      .pipe(
        map((res: any) =>
          res.map((supplierJson: any) => new Supplier(supplierJson))
        )
      );
  }
}
