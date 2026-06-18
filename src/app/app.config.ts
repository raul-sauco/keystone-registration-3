import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MarkdownModule } from 'ngx-markdown';

import { AuthService } from '@services/auth/auth.service';
import { CustomTranslationsLoader } from '@services/custom-translate-loader/custom-translate-loader.service';
import { environment } from 'src/environments/environment';
import { routes } from './app.routing';
import { Auth401Interceptor } from './http-interceptors/auth-401-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // TODO: Experiment with removing zone
    // provideExperimentalZonelessChangeDetection(),
    provideZoneChangeDetection(),
    importProvidersFrom(
      MarkdownModule.forRoot(),
      LoggerModule.forRoot({
        serverLoggingUrl: environment.apiUrl + 'portal-logs',
        level: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.TRACE,
        serverLogLevel: NgxLoggerLevel.WARN,
      }),
    ),
    { provide: HTTP_INTERCEPTORS, useClass: Auth401Interceptor, multi: true },
    provideAppInitializer(async () => {
      await inject(AuthService).initialize();
    }),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables()),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideTranslateService({
      loader: provideTranslateLoader(CustomTranslationsLoader),
    }),
  ],
};
