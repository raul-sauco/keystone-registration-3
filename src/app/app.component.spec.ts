import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        LoggerTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json')
        }),
        BrowserAnimationsModule,  // Material needs animations
        MatToolbarModule,
        MatSidenavModule,
        MatListModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Keystone Adventures'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Keystone Adventures');
  });

  it('should render title on header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled
      .querySelector('#main-header').textContent)
      .toContain('Keystone Adventures');
  });
});
