import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
import zhHans from '@angular/common/locales/zh-Hans';
import { importProvidersFrom, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MarkdownModule } from 'ngx-markdown';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routing';
import { Auth401Interceptor } from './app/http-interceptors/auth-401-interceptor';
import { environment } from './environments/environment';
import { CustomTranslationsLoader } from '@services/custom-translate-loader/custom-translate-loader.service';
import { provideNativeDateAdapter } from '@angular/material/core';

registerLocaleData(en);
registerLocaleData(zh);
registerLocaleData(zhHans);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      MarkdownModule.forRoot(),
      LoggerModule.forRoot({
        serverLoggingUrl: environment.apiUrl + 'portal-logs',
        level: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.TRACE,
        serverLogLevel: NgxLoggerLevel.WARN,
      })
    ),
    { provide: HTTP_INTERCEPTORS, useClass: Auth401Interceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables()),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideTranslateService({
      loader: provideTranslateLoader(CustomTranslationsLoader),
    }),
  ],
}).catch(err => console.error(err));
