import { computed, inject, Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

@Service()
export class LocalizationService {
  private readonly translate = inject(TranslateService);

  readonly currentLanguage = toSignal(
    this.translate.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this.translate.getCurrentLang()),
    ),
    {
      requireSync: true,
    },
  );

  readonly isChinese = computed(() => this.currentLanguage().startsWith('zh'));

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  instant(key: string, params?: object): string {
    return this.translate.instant(key, params);
  }
}
