import { LayoutModule } from '@angular/cdk/layout';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MarkdownModule } from 'ngx-markdown';

import { AdminBannerModule } from '@components/admin-banner/admin-banner.module';
import { CustomTranslationsLoader } from '@services/custom-translate-loader/custom-translate-loader.service';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Auth401Interceptor } from './http-interceptors/auth-401-interceptor';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslationsLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    LayoutModule,
    MatToolbarModule,
    MatBadgeModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MarkdownModule.forRoot({ loader: HttpClient }),
    LoggerModule.forRoot({
      serverLoggingUrl: environment.apiUrl + 'portal-logs',
      level: environment.production
        ? NgxLoggerLevel.INFO
        : NgxLoggerLevel.TRACE,
      serverLogLevel: NgxLoggerLevel.WARN,
    }),
    AdminBannerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Auth401Interceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
