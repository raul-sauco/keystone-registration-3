import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supplier } from 'src/app/models/supplier';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { AdminBannerComponent } from '../../components/admin-banner/admin-banner.component';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';
import { LoginRequiredMessageComponent } from '../../components/login-required-message/login-required-message.component';
import { NoResultsComponent } from '../../components/no-results/no-results.component';
import { SupplierItemComponent } from '../../components/supplier-item/supplier-item.component';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LoginRequiredMessageComponent,
    AdminBannerComponent,
    SupplierItemComponent,
    NoResultsComponent,
    LoadingSpinnerContentComponent,
    AsyncPipe,
  ],
})
export class AccommodationComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);
  private route = inject(ActivatedRoute);
  private routeStateService = inject(RouteStateService);

  supplier$!: Observable<Supplier[]>;
  needsLogin = false;

  ngOnInit(): void {
    this.logger.debug('AccommodationComponent OnInit');
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
        this.fetch(requestParams);
      } else {
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res && this.auth.getAccessToken()) {
            this.fetch(params);
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
  fetch(params: any): void {
    const endpoint = 'accommodation';
    this.supplier$ = this.api
      .get(endpoint, params)
      .pipe(map((res: any) => res.map((supplierJson: any) => new Supplier(supplierJson))));
  }
}
