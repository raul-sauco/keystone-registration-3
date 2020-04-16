import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Trip } from '../../models/trip';
import { HttpHeaders } from '@angular/common/http';
import { TripPackingListItem } from '../../models/tripPackingListItem';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  public trip: Trip;
  trip$: Subject<Trip> = new Subject<Trip>();
  public ready: boolean;
  public loading: boolean;
  public formattedItinerary: any;
  private endpoint = 'my-itinerary';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private translate: TranslateService
    ) {
    this.init();
  }

  init(): void {

    this.formattedItinerary = {};
    this.ready = false;
    this.loading = false;

    // TODO check if we have a trip in local storage
    this.auth.checkAuthenticated().then(
      authResult => {
        if (authResult) {

          // Fetch the trip info from the server, will use the user's token to authenticate
          this.fetchTrip().then(
            res => {}
          );
        } else {
          console.warn('TripProvider.init() could not get credentials');
        }
      }
    );
  }

  /**
   * Recover the trip's details from the API
   */
  fetchTrip(): Promise<boolean> {

    return new Promise<boolean>(
      (resolve) => {

        if (this.loading) {

          // If we are ready
          if (this.ready) {
            resolve(true);
          } else {
            // resolve(false) working...let it work
          }

        } else {

          this.loading = true;

          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: ' Bearer ' + this.auth.getCredentials().accessToken
          });

          const options = {
            headers
          };

          this.api.get(this.endpoint, null, options).subscribe(
            (response: any) => {
              // TODO handle errors

              // console.log(response.trip);
              this.trip = new Trip(response.trip);

              this.formatItinerary();
              this.fetchPackingListItems();
              this.sortGuides();

              this.loading = false;
              this.ready = true;

              resolve(true);
            });
        }
      }
    );
  }

  /**
   * Constructs an ordered instance of the itinerary that the views can
   * use easily. It takes the form:
   *
   *    {
   *      '2018-11-25': {
   *                      'id': 25,
   *                      'name': 'Climbing at Linan'
   *                      ...
   *                    },
   *                    {...}
   *                    },
   *      '2018-11-26': {...}
   *    }
   */
  formatItinerary() {

    // Construct an array on the form date => Event[]
    this.trip.itinerary.forEach((item) => {

      if (this.formattedItinerary[item.date] == null) {
        this.formattedItinerary[item.date] = [];

      }
      // todo order the dates by date
      this.formattedItinerary[item.date].push(item);

    });

    this.sortEventsPerDate();

  }

  /**
   * Fetch all the packing list items on the packing list for the trip.
   */
  fetchPackingListItems() {

    // TODO temporary fix while no pagination, get 50 per page.
    const endpoint = 'trip-packing-list-items?per-page=50&expand=item&trip_id=' + this.trip.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: ' Bearer ' + this.auth.getCredentials().accessToken
    });

    const options = {
      headers,
      observe: 'response'
    };

    this.api.get(endpoint, null, options).subscribe(
      (response: any) => {

        // TODO access pagination headers
        // console.log(response.headers);

        // Check the language
        let lang = 0; // en-US
        if (this.translate.currentLang.match(/zh/i)) {
          lang = 1; // zh-CN
        }

        // Iterate over the data and assign it to new object
        response.body.forEach((tpliJson) => {

          const tpli = new TripPackingListItem(tpliJson);
          tpli.lang = lang;

          this.trip.packingListItems.push(tpli);

        });

      });

  }

  /**
   * Sort the trip guides alphabetically.
   */
  sortGuides(): void {
    this.trip.guides.sort( ( a, b ) => {
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Sort all the events on each date per start time.
   */
  sortEventsPerDate() {

    for (const dateKey in this.formattedItinerary) {

      if (this.formattedItinerary.hasOwnProperty(dateKey)) {

        this.formattedItinerary[dateKey].sort( ( a, b ) => {
          return a.start_time.localeCompare(b.start_time);
        });

      }

    }

  }
}
