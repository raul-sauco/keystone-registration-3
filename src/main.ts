import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
import zhHans from '@angular/common/locales/zh-Hans';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

registerLocaleData(en);
registerLocaleData(zh);
registerLocaleData(zhHans);

if (environment.production) {
  enableProdMode();
}

// TODO: Remove this temporary check in v22
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
