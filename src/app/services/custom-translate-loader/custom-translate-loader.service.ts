import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

export class CustomTranslationsLoader implements TranslateLoader {
  private http = inject(HttpClient);

  public getTranslation(lang: String): Observable<any> {
    return this.http.get(`${environment.resUrl}portal/i18n/${lang}.json`);
  }
}
