import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryComponent } from './itinerary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('ItineraryComponent', () => {
  let component: ItineraryComponent;
  let fixture: ComponentFixture<ItineraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryComponent ],
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        LoadingSpinnerContentModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json')
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
