import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MarkdownModule } from 'ngx-markdown';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { PackingListComponent } from './packing-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PackingListComponent', () => {
  let component: PackingListComponent;
  let fixture: ComponentFixture<PackingListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [AdminBannerModule,
        BrowserAnimationsModule,
        LoadingSpinnerContentModule,
        LoggerTestingModule,
        MatIconModule,
        MatSnackBarModule,
        MatTabsModule,
        MarkdownModule.forRoot({
            sanitize: SecurityContext.NONE,
        }),
        RouterTestingModule,
        TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
        }), PackingListComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
