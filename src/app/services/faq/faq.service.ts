import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NGXLogger } from 'ngx-logger';
import { of, Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Faq } from 'src/app/models/faq';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(
    private api: ApiService,
    private logger: NGXLogger
  ) {
    this.logger.debug('FaqService constructor called');
  }

  /**
   * Return an observable that resolves in an array of FAQ
   * data for the corresponding trip.
   *
   * @param string tripId the id of the trip to fetch for
   */
  fetchFaq(tripId: string): Observable<Faq[]> {

    this.logger.debug('FaqService fetching FAQs called', tripId);

    if (!tripId) {
      return of(null);
    }

    const endpoint = 'trip-questions';
    const params = {'trip-id': tripId};
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: ' Bearer ' + (this.auth.getCredentials().accessToken || '') todo
      }),
      // observe: 'response'
    };

    // Return an API call
    return this.api.get(endpoint, params, options).pipe(
      map((faqjson: any) => {

        // Sort the guides and map them to Guide models
        return faqjson.sort(
            (a: any, b: any) => a.updated_at - b.updated_at
          ).map((faq: any) => new Faq(faq) );

      })
    );

  }
}
