import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, delay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { RouteStateService } from './services/route-state/route-state.service';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Keystone Adventures';
  tripId$: Observable<string | null>;
  tripId: string = null;

  public appPages = [
    {title: 'HOME', url: '/home', icon: 'home'},
    {title: 'ITINERARY', url: '/itinerary', icon: 'list'},
    {title: 'PACKING_LIST', url: '/packing-list', icon: 'work'},
    {title: 'GUIDES', url: '/guides', icon: 'contacts'},
    {title: 'FAQ', url: '/faq', icon: 'chatbubbles'},
    {title: 'DOCUMENTS', url: '/documents', icon: 'document'}
  ];

  public policyPages = [
    {title: 'WAIVER', url: '/waiver', icon: 'paper'},
    {title: 'PRIVACY_POLICY', url: '/privacy-policy', icon: 'glasses'}
  ];

  public mePages = [
    {title: 'PERSONAL_INFORMATION', url: '/personal-info', icon: 'person', render: this.auth.auth$}
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService,
    private logger: NGXLogger,
    private routeStateService: RouteStateService,
    private router: Router,
    public auth: AuthService
    ) {
      this.initTranslate();
    }

  ngOnInit() {
    // Subscribe to the routeStateService to get updates on the trip ID parameter
    this.tripId$ = this.routeStateService.tripIdParam$.pipe(delay(0));
  }

  initTranslate() {

    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.logger.debug(`TranslateService language set to "${this.translate.currentLang}"`);

  }

  /** Logout the current application user */
  logout() {
    const username = this.auth.getCredentials().userName;
    this.auth.logout().then(res => {
      this.logger.debug(`User ${username} logged out`);
    }).catch(error => {
      this.logger.warn('AppComponent error logging out', error);
    });
  }
}
