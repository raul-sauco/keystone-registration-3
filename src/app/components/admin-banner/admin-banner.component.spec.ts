import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { AdminBannerComponent } from './admin-banner.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AdminBannerComponent', () => {
  let component: AdminBannerComponent;
  let fixture: ComponentFixture<AdminBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LoggerTestingModule,
        TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
        }), AdminBannerComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
