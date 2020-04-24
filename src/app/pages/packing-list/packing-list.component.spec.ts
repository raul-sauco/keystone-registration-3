import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingListComponent } from './packing-list.component';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('PackingListComponent', () => {
  let component: PackingListComponent;
  let fixture: ComponentFixture<PackingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingListComponent ],
      imports: [
        BrowserAnimationsModule,
        MarkdownModule.forChild(),
        HttpClientTestingModule,
        LoggerTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        LoadingSpinnerContentModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json')
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
