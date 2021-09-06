import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ActivityGroup } from 'src/app/models/activityGroup';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { EventService } from '../event/event.service';
import { Event } from 'src/app/models/event';

@Injectable({
  providedIn: 'root',
})
export class ActivityGroupService {
  activityGroups: ActivityGroup[] = [];
  activityGroup$: Subject<ActivityGroup[]> = new Subject<ActivityGroup[]>();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private eventService: EventService,
    private logger: NGXLogger
  ) {
    this.eventService.event$.subscribe(
      (data) => {
        this.logger.debug(
          `ActivityGroupService got ${data.length} events from EventService`
        );
        this.addEventsToActivityGroups(data);
      },
      (err: string) => {
        this.logger.warn(`ActivityGroupService event observable error: ${err}`);
        this.activityGroup$.error(err);
      }
    );
  }

  /**
   * Fetch activity groups.
   * If we have a logged in participant, the server will return the
   * activity groups for their own trip, otherwise, send a trip id
   * to get that trips activity groups.
   *
   * @param tripId optional parameter if we don't have a logged in user
   */
  fetchActivityGroups(tripId: string | null = null) {
    // Reset the activity group array.
    this.activityGroups = [];
    const endpoint = 'activity-groups';
    const headers: any = { 'Content-Type': 'application/json' };
    let params = null;
    let fetch = false;
    if (tripId !== null) {
      params = { 'trip-id': tripId };
      fetch = true;
    } else if (
      this.auth.authenticated &&
      this.auth.getCredentials()?.accessToken
    ) {
      headers.authorization =
        ' Bearer ' + this.auth.getCredentials()?.accessToken;
      fetch = true;
    }

    if (fetch) {
      const options = {
        headers: new HttpHeaders(headers),
        observe: 'response',
      };
      this.fetchActivityGroupBatch(endpoint, params, options);
    }
  }

  /**
   * Fetch a batch of activty groups from the backend. The endpoint
   * can be a relative or absolute url to support pagination.
   *
   * @param endpoint request endpoint
   * @param params request parameters
   * @param options request options; headers, observe
   */
  fetchActivityGroupBatch(endpoint: string, params: any, options: any): void {
    this.api.get(endpoint, params, options).subscribe((resp: any) => {
      // TODO handle errors
      this.addActivityGroups(resp.body);

      if (this.api.hasNextPage(resp.headers)) {
        this.fetchActivityGroupBatch(
          this.api.nextPageUrl(resp.headers),
          null,
          options
        );

        this.logger.debug(
          'Fetching next ag page at: ' + this.api.nextPageUrl(resp.headers)
        );
      } else {
        // There are no more pages of data, notify subscribers
        this.activityGroup$.next(this.activityGroups);
      }
    });
  }

  /**
   * Add an array of Activity Groups to the provider given their JSON data.
   *
   * @param activityGroups JSON with the activity groups data
   */
  addActivityGroups(activityGroups: any) {
    this.logger.debug(
      `Adding ${activityGroups.length} activity groups to provider`
    );

    /*
     * TODO look into fetching all events using observables instead of
     * using array.forEach() Some links:
     *
     * https://blog.angular-university.io/angular-http/
     * https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin
     * https://rxjs.dev/api/index/function/forkJoin
     */
    activityGroups.forEach((ag: any) => {
      this.eventService.fetchEvents(ag.id);

      // Check if the activity group is already in the array
      const index = this.activityGroups.findIndex((e) => e.id === ag.id);

      // If we find the activity group update it, otherwise add it
      if (index !== -1) {
        this.activityGroups[index] = new ActivityGroup(ag);
      } else {
        this.activityGroups.push(new ActivityGroup(ag));
      }
    });
  }

  /**
   * Event provider event$ observable notified that it has updated events,
   * use the payload to update the activity groups event[] property.
   *
   * @param events an array containing all events for all activity groups
   */
  addEventsToActivityGroups(events: Event[]) {
    this.logger.debug(
      `AGS132 Adding ${events.length} Events to ActivityGroups`
    );

    this.activityGroups.forEach((ag: ActivityGroup) => {
      ag.setEvents(events.filter((event) => event.activityGroupId === ag.id));
    });
  }
}
