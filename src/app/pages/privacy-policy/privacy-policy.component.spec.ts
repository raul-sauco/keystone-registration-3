import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PrivacyPolicyComponent } from './privacy-policy.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: TranslateService, useClass: TranslateServiceStub },
        ],
        declarations: [PrivacyPolicyComponent],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          LoggerTestingModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
