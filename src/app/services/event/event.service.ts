import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Event } from 'src/app/models/event';
import { ApiService } from '../api/api.service';
import { NGXLogger } from 'ngx-logger';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: Event[] = [];
  event$: Subject<Event[]> = new Subject<Event[]>();

  constructor(
    private api: ApiService,
    private logger: NGXLogger
  ) { }

  /**
   * Fetch all events for a given ActivityGroup
   * @param activityGroupId id of the Activity Group to fetch events for
   */
  fetchEvents(activityGroupId) {
    this.fetchEventBatch('events', {'ag-id': activityGroupId});
  }

  /**
   * Fetch a batch of events from the backend.
   *
   * @param endpoint request endpoint or full url
   * @param params extra request parameters
   */
  fetchEventBatch(endpoint: string, params: any): void {

    this.logger.debug(`Fetching EVENT page. URL: ${endpoint}`);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: ' Bearer ' + (this.auth.getCredentials().accessToken || '') todo
      }),
      observe: 'response'
    };

    this.api.get(endpoint, params, options).subscribe(
      (resp: any) => {

        // Call the function event when no results, O1
        this.addEvents(resp.body);

        if (this.api.hasNextPage(resp.headers)) {

          return this.fetchEventBatch(this.api.nextPageUrl(resp.headers), null);

        } else {

          // There are no more pages, return events
          this.logger.debug(`Last EVENT page fetched, returning events`);
          this.event$.next(this.events);

        }
      }
    );

  }

  /**
   * Add events to an existing event array, if the array is empty
   * only the logger runs.
   */
  addEvents(events: any) {

    this.logger.debug(`Adding ${events.length} events to EventService`);

    events.forEach(event => {

      const index = this.events.findIndex( e => e.id === event.id);

      if (index !== -1) {

        this.events[index] = new Event(event);

      } else {

        this.events.push(new Event(event));

      }

    });
  }
}
