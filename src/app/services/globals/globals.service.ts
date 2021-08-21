import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  private resUrl: string;
  private apiUrl: string;

  /** Return the dev or prod resource url */
  getResUrl(): string {
    return this.resUrl;
  }

  /** Return the dev or prod api url */
  getApiUrl(): string {
    return this.apiUrl;
  }

  constructor() {
    this.apiUrl = environment.apiUrl;
    this.resUrl = environment.resUrl;
  }
}

/** AppComponent cannot import the service, needs a const. */
export const apiUrl = {
  production: 'https://apivp1.keystone-adventures.com/',
  development: 'http://localhost/ka-apivp1/',
};
