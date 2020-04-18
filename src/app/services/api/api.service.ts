import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { GlobalsService } from 'src/app/local/globals.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string;

  constructor(
    public http: HttpClient,
    private globals: GlobalsService,
    private logger: NGXLogger
  ) {
    this.url = globals.getApiUrl();
  }

  /**
   * Get data from a remote server.
   * @param endpoint it can be a full URL like https://api.github.com/users or
   * just an string representing an endpoint.
   * The second case will be interpreted like an endpoint for the main API
   *
   * @param params support easy query params for GET requests.
   * @param reqOpts an object with options to configure the HttpRequest object.
   */
  get(endpoint: string, params?: any, reqOpts?: any) {

    /* Allow both full URLs and endpoints for main API https://stackoverflow.com/a/19709846/2557030 */
    const url = endpoint.includes('http://') ||
      endpoint.includes('https://') ? endpoint : (this.url + endpoint);

    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      // TSLint complains about for (... in ...)
      // https://stackoverflow.com/a/43083415/2557030
      for (const k of Object.keys(params)) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(url, reqOpts)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + endpoint, body, reqOpts);
  }

  /**
   * Checks if the headers indicate that there is a nex page of results.
   *
   * @param headers an HttpHeaders object
   */
  hasNextPage(headers: HttpHeaders): boolean {
    return headers.get('link').includes('rel=next');
  }

  /**
   * Get the link for the next page of results if there are any.
   *
   * @param headers a JSON object with the htttp response headers
   */
  nextPageUrl(headers: HttpHeaders): string {
    const links = headers.get('link').split(',');
    let next = links.find(l => l.includes('rel=next') );
    next = next.split(';')[0];
    next = next.replace(/[<>]/gi, '');
    return next;
  }

  /**
   * https://angular.io/guide/http#getting-error-details
   * @param HttpErrorResponse error
   */
  private handleError(error: HttpErrorResponse) {

    let msg: string;

    if (error.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.
      msg = `Network error`;

    } else {

      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      msg = `Server error`;

    }

    // Error level logs get sent to the server
    this.logger.error(
      `ApiService ${msg}: ${error.error.message}`,
      {
        url: error.url,
        name: error.name,
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        error,
        yiiError: error.error
      }
    );

    // return an observable with a user-facing error message
    return throwError(`${msg}; please try again later.`);
  }

}
