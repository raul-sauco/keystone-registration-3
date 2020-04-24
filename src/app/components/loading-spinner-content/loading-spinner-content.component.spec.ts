import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';

import { LoadingSpinnerContentComponent } from './loading-spinner-content.component';

describe('LoadingSpinnerContentComponent', () => {
  let component: LoadingSpinnerContentComponent;
  let fixture: ComponentFixture<LoadingSpinnerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingSpinnerContentComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json')
        })
      ]
    })
    .compileComponents();
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
