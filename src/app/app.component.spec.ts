import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          LoggerTestingModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
          BrowserAnimationsModule, // Material needs animations
          MatIconModule,
          MatToolbarModule,
          MatSidenavModule,
          MatListModule,
        ],
        declarations: [AppComponent],
      });
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create the app', () => {
    expect(component).toBeDefined();
  });

  it(`should have as title 'Keystone Adventures'`, () => {
    expect(component.title).toEqual('Keystone Adventures');
  });

  it('should have a side-menu', () => {
    const appElement: HTMLElement = fixture.nativeElement;
    const sideNav = appElement.querySelector('mat-sidenav');
    expect(sideNav).toBeTruthy();
    // component.ngOnInit();
    fixture.detectChanges();
    expect(sideNav.textContent).toContain('HOME');
  });
});
