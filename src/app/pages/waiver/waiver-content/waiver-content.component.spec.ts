import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';

import { WaiverContentComponent } from './waiver-content.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('WaiverContentComponent', () => {
  let component: WaiverContentComponent;
  let fixture: ComponentFixture<WaiverContentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    declarations: [WaiverContentComponent],
    imports: [RouterTestingModule,
        LoggerTestingModule,
        TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
        })],
    providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiverContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
