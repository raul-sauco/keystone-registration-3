import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatRippleModule } from '@angular/material/core';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpLoaderFactory } from 'src/app/app.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { TripSwitcherComponent } from './trip-switcher.component';

describe('TripSwitcherComponent', () => {
  let component: TripSwitcherComponent;
  let fixture: ComponentFixture<TripSwitcherComponent>;
  let translate: TranslateService;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripSwitcherComponent],
      imports: [
        HttpClientTestingModule,
        LoadingSpinnerContentModule,
        LoggerTestingModule,
        MatRippleModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    http = TestBed.inject(HttpTestingController);
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
