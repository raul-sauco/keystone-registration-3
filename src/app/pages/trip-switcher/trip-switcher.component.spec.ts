import { TranslateTestingModule } from 'ngx-translate-testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TripSwitcherComponent } from './trip-switcher.component';

describe('TripSwitcherComponent', () => {
  let component: TripSwitcherComponent;
  let fixture: ComponentFixture<TripSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripSwitcherComponent],
      imports: [
        LoggerTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
