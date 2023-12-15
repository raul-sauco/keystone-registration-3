import { EventEmitter } from '@angular/core';
import { LangChangeEvent } from '@ngx-translate/core';
import { of } from 'rxjs';

export class TranslateServiceStub {
  public onLangChange = new EventEmitter<LangChangeEvent>();
  public currentLang = 'en';
  public get(key: any): any {
    return of(key);
  }
}
