import { of } from 'rxjs';

export class TranslateServiceStub {
  public currentLang = 'en';
  public get(key: any): any {
    return of(key);
  }
}
