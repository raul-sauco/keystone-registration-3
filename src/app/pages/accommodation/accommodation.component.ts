import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supplier } from 'src/app/models/supplier';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';
import { AsyncPipe } from '@angular/common';
import { LoginRequiredMessageComponent } from '../../components/login-required-message/login-required-message.component';
import { AdminBannerComponent } from '../../components/admin-banner/admin-banner.component';
import { SupplierItemComponent } from '../../components/supplier-item/supplier-item.component';
import { NoResultsComponent } from '../../components/no-results/no-results.component';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';

@Component({
    selector: 'app-accommodation',
    templateUrl: './accommodation.component.html',
    styleUrls: ['./accommodation.component.scss'],
    imports: [LoginRequiredMessageComponent, AdminBannerComponent, SupplierItemComponent, NoResultsComponent, LoadingSpinnerContentComponent, AsyncPipe]
})
export class AccommodationComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);
  private route = inject(ActivatedRoute);
  private routeStateService = inject(RouteStateService);
  private tripSwitcher = inject(TripSwitcherService);

  supplier$!: Observable<Supplier[]>;
  needsLogin = false;

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
          if (res && this.auth.getAccessToken()) {
            // School admins do not have a trip by default.
            if (this.auth.isSchoolAdmin) {
              if (this.tripSwitcher.selectedTrip) {
                requestParams['trip-id'] = this.tripSwitcher.selectedTrip.id;
                this.fetch(requestParams, headers);
              } else {
                this.supplier$ = of([]);
              }
            } else {
              headers.authorization = `Bearer ${
                this.auth.getAccessToken()
              }`;
              this.fetch(params, headers);
            }
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
