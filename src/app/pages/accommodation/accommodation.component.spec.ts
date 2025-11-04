import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { AccommodationComponent } from './accommodation.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AccommodationComponent', () => {
  let component: AccommodationComponent;
  let fixture: ComponentFixture<AccommodationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [LoadingSpinnerContentModule,
        LoggerTestingModule,
        RouterTestingModule,
        TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
        }), AccommodationComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
