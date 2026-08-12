import { computed, inject, Service } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Service()
export class LocalizationService {
  private readonly translate = inject(TranslateService);

  readonly currentLanguage = this.translate.currentLang;

  readonly isChinese = computed(() => this.currentLanguage()?.startsWith('zh') ?? false);

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  instant(key: string, params?: object): string {
    return this.translate.instant(key, params);
  }
}
