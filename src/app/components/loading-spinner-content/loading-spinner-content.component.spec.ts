import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';

import { LoadingSpinnerContentComponent } from './loading-spinner-content.component';

describe('LoadingSpinnerContentComponent', () => {
  let component: LoadingSpinnerContentComponent;
  let fixture: ComponentFixture<LoadingSpinnerContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
        LoadingSpinnerContentComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingSpinnerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
