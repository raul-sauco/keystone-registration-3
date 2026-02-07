import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpLoaderFactory } from 'src/app/app.module';
import { KaMdDocumentComponent } from './ka-md-document.component';

describe('KaMdDocumentComponent', () => {
  let component: KaMdDocumentComponent;
  let fixture: ComponentFixture<KaMdDocumentComponent>;
  let translate: TranslateService;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        KaMdDocumentComponent,
        LoggerTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        TranslateService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    http = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(KaMdDocumentComponent);
    component = fixture.componentInstance;
    component.endpoint = 'documents/1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
