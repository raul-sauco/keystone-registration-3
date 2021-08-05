import { LoadingSpinnerContentComponent } from './../../components/loading-spinner-content/loading-spinner-content.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FaqComponent } from './faq.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: TranslateService, useClass: TranslateServiceStub },
          { provide: LoadingSpinnerContentComponent, use: {} },
        ],
        imports: [
          HttpClientTestingModule,
          LoggerTestingModule,
          RouterTestingModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
        ],
        declarations: [FaqComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
