import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomTranslationsLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  public getTranslation(lang: String): Observable<any> {
    return this.http.get(`${environment.resUrl}portal/i18n/${lang}.json`);
  }
}
