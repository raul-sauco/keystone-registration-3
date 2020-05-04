import { Component, OnInit } from '@angular/core';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  tripId: string = null;
  feedback$: Observable<any>;

  constructor(
    private routeStateService: RouteStateService,
    private route: ActivatedRoute,
    private logger: NGXLogger,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.logger.debug('FeedbackComponent OnInit');

    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      this.logger.debug(`FeedbackComponent OnInit: ParamMap tripId: ${tripId}`);

      // If the url has a parameter, let RouteStateService handle it
      if (tripId !== null) {
        this.routeStateService.tripIdParam$.subscribe((id: string) => {
          // Always update the components trip-id if found in the URL
          this.tripId = tripId;
          if (tripId !== id) {
            this.logger.debug(
              `FeedbackComponent OnInit: url param tripId ${tripId} ` +
              `does not match RouterStateService param tripId ${id}, updating.`);
            this.routeStateService.updateTripIdParamState(tripId);
          }
          // We should have correct tripId at this point
          this.fetch();
        });
      } else {
        // No tripId URL parameter, find it on service
        this.routeStateService.tripIdParam$.subscribe((id: string) => {
          if (!id) {
            this.logger.warn('FeedbackComponent warning; RouterStateService did not have a tripId');
          } else {
            this.tripId = id;
            this.fetch();
          }
        });
      }
    });
  }

  /**
   * Subscribe to the ApiService to get feedback data
   */
  fetch(): void {
    this.logger.debug('FeedbackComponent fetch() called');
    const endpoint = 'feedbacks';
    const params = {'trip-id': this.tripId};
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: ' Bearer ' + (this.auth.getCredentials().accessToken || '') todo
      })
    };

    this.feedback$ = this.api.get(endpoint, params, options);
  }
}
