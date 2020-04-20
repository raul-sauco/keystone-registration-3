import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { share, map } from 'rxjs/operators';
import { Guide } from 'src/app/models/guide';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  constructor(
    private api: ApiService,
    private logger: NGXLogger
  ) {
    this.logger.debug('GuideService constructor called');
  }

  /**
   * Return an observable that resolves in an array of guides data
   * participating in the trip passed on as a parameter.
   *
   * @param tripId the id of the trip to fetch for
   */
  fetchGuides(tripId: string): Observable<any> {

    this.logger.debug('GuideService fetchGuides called', tripId);

    if (!tripId) {
      return of(null);
    }

    const endpoint = 'guides';
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
      map((res: any) => {

        // Sort the guides and map them to Guide models
        return res.sort(
            (a: any, b: any) => a.nickname.localeCompare(b.nickname)
          ).map(guideJSON => new Guide(guideJSON) );

      })
    );

  }
}
