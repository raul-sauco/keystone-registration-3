import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MarkdownModule } from 'ngx-markdown';
import { MatCardModule } from '@angular/material/card';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        BrowserAnimationsModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json')
        }),
        MarkdownModule.forRoot(),
        MatCardModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
