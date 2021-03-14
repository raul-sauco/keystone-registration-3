import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';

import { TripPackingListItem } from 'src/app/models/tripPackingListItem';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PackingListService {
  items: TripPackingListItem[] = [];
  item$: Subject<TripPackingListItem[]> = new Subject<TripPackingListItem[]>();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private translate: TranslateService
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
    const headers: any = { 'Content-Type': 'application/json' };
    const params = { expand: 'item' };
    let fetch = false;
    if (tripId !== null) {
      params['trip-id'] = tripId;
      fetch = true;
    } else if (
      this.auth.authenticated &&
      this.auth.getCredentials().accessToken
    ) {
      headers.authorization =
        ' Bearer ' + this.auth.getCredentials().accessToken;
      fetch = true;
    }

    if (fetch) {
      // Clean up
      this.items = [];
      const options = {
        headers: new HttpHeaders(headers),
        observe: 'response',
      };
      this.fetchItemBatch(endpoint, params, options);
    }
  }

  /**
   * Have the API request one page of data for the trip that
   * we are currently requesting for.
   *
   * @param endpoint the endpoint for the current API call
   * @param params an object with parameters to be passed to the call
   */
  protected fetchItemBatch(endpoint: string, params: any, options: any): void {
    this.logger.debug(`PackingListService fetching ${endpoint}`);
    this.api.get(endpoint, params, options).subscribe((resp: any) => {
      this.addItems(resp.body);
      if (this.api.hasNextPage(resp.headers)) {
        this.fetchItemBatch(this.api.nextPageUrl(resp.headers), null, options);
      } else {
        // We fetched all the available items, notify subscribers
        this.item$.next(this.items);
      }
    });
  }

  /**
   * Use the ApiService response to instantiate new
   * TripPackingListItems and add them to the service array.
   *
   * @param items JSON array with data for a batch of items
   */
  protected addItems(items: any): void {
    this.logger.debug(`Adding ${items.length} packing list items to provider`);
    items.forEach((i) => {
      // Pass the language to the PLI
      i.lang = this.translate.currentLang;
      this.items.push(new TripPackingListItem(i));
    });
  }
}
