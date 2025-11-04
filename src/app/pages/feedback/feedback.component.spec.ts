import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { NoItemsNotificationModule } from 'src/app/components/no-items-notification/no-items-notification.module';
import { FeedbackComponent } from './feedback.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [AdminBannerModule,
        LoggerTestingModule,
        NoItemsNotificationModule,
        RouterTestingModule,
        TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
        }), FeedbackComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
