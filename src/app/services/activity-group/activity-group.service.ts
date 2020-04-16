import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ActivityGroup } from 'src/app/models/activityGroup';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ActivityGroupService {

  activityGroups: ActivityGroup[] = [];
  activityGroup$: Subject<ActivityGroup[]> = new Subject<ActivityGroup[]>();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger
  ) { }

  /**
   * Fetch activity groups.
   * If we have a logged in participant, the server will return the
   * activity groups for their own trip, otherwise, send a trip id
   * to get that trips activity groups.
   *
   * @param tripId optional parameter if we don't have a logged in user
   */
  fetchActivityGroups(tripId = null) {
    const endpoint = 'activity-groups';
    let  params = null;

    if (tripId !== null) {
      params = {'trip-id': tripId};
    }

    this.fetchActivityGroupBatch(endpoint, params);
  }

  /**
   * Fetch a batch of activty groups from the backend. The endpoint
   * can be a relative or absolute url to support pagination.
   *
   * @param endpoint request endpoint
   * @param params request parameters
   */
  fetchActivityGroupBatch(endpoint: string, params: any): void {

    // Options will be the same in requests for other pages
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: ' Bearer ' + (this.auth.getCredentials().accessToken || '') todo
      }),
      observe: 'response'
    };

    this.api.get(endpoint, params, options).subscribe(
      (resp: any) => {

        // TODO handle errors
        this.addActivityGroups(resp.body);

        if (this.api.hasNextPage(resp.headers)) {
          this.fetchActivityGroupBatch(this.api.nextPageUrl(resp.headers), null);

          this.logger.debug('Fetching next ag page at: ' + this.api.nextPageUrl(resp.headers));

        } else {

          // There are no more pages of data, notify subscribers
          this.activityGroup$.next(this.activityGroups);

        }
      }
    );
  }

  /**
   * Add an array of Activity Groups to the provider given their JSON data.
   *
   * @param activityGroups JSON with the activity groups data
   */
  addActivityGroups(activityGroups: any): void {

    this.logger.debug(`Adding ${activityGroups.length} activity groups to provider`);

    activityGroups.forEach(ag => {

      // Check if the activity group is already in the array
      const index = this.activityGroups.findIndex( e => e.id === ag.id);

      // If we find the activity group update it, otherwise add it
      if (index !== -1) {
        this.activityGroups[index] = new ActivityGroup(ag);
      } else {
        this.activityGroups.push(new ActivityGroup(ag));
      }

    });

  }
}
