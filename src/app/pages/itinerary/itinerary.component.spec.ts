import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { ItineraryComponent } from './itinerary.component';

describe('ItineraryComponent', () => {
  let component: ItineraryComponent;
  let fixture: ComponentFixture<ItineraryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItineraryComponent],
        imports: [
          HttpClientTestingModule,
          LoggerTestingModule,
          RouterTestingModule,
          MatSnackBarModule,
          BrowserAnimationsModule,
          LoadingSpinnerContentModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
