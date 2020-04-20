import { Injectable } from '@angular/core';
import { TripPackingListItem } from 'src/app/models/tripPackingListItem';
import { Subject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { NGXLogger } from 'ngx-logger';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackingListService {

  items: TripPackingListItem[] = [];
  item$: Subject<TripPackingListItem[]> = new Subject<TripPackingListItem[]>();

  constructor(
    private api: ApiService,
    private logger: NGXLogger
  ) {
    this.logger.debug('PackingListService constructor called');
  }

  /**
   * Fetch all TripPackingListItems for a given trip and add them
   * to the provider. When last page has been fetched the service
   * will notify subscribers to item$.
   *
   * @param string|null tripId ID of the trip to fetch items for
   */
  fetchItems(tripId: string = null): void {

    const endpoint = 'trip-packing-list-items';
    const params = {expand: 'item'};

    if (tripId !== null) {
      params['trip-id'] = tripId;
    }

    this.fetchItemBatch(endpoint, params);
  }

  /**
   * Have the API request one page of data for the trip that
   * we are currently requesting for.
   *
   * @param endpoint the endpoint for the current API call
   * @param params an object with parameters to be passed to the call
   */
  protected fetchItemBatch(endpoint: string, params: {}): void {

    this.logger.debug(`PackingListService fetching ${endpoint}`);

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

        this.addItems(resp.body);

        if (this.api.hasNextPage(resp.headers)) {
          this.fetchItemBatch(this.api.nextPageUrl(resp.headers), null);
        } else {
          // We fetched all the available items, notify subscribers
          this.item$.next(this.items);
        }
      }
    );
  }

  /**
   * Use the ApiService response to instantiate new
   * TripPackingListItems and add them to the service array.
   *
   * @param items JSON array with data for a batch of items
   */
  protected addItems(items: any): void {

    this.logger.debug(`Adding ${items.length} packing list items to provider`);

    items.forEach(i => {
      this.items.push(new TripPackingListItem(i));
    });
  }
}
