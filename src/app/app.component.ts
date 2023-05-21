import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import {
  delay,
  filter,
  map,
  shareReplay,
  withLatestFrom,
} from 'rxjs/operators';

import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { RouteStateService } from '@services/route-state/route-state.service';
import { StudentService } from '@services/student/student.service';
import { TripSwitcherService } from '@services/trip-switcher/trip-switcher.service';
import { TripService } from '@services/trip/trip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('drawer', { static: true })
  drawer!: MatSidenav;
  title = 'Keystone Adventures';
  tripId$!: Observable<string | null>;
  tripId: string | null = null;

  public appPages = [
    {
      title: 'OVERVIEW',
      url: '/program-overview',
      icon: 'preview',
      render: of(true),
    },
    { title: 'ITINERARY', url: '/itinerary', icon: 'list', render: of(true) },
    {
      title: 'ACCOMMODATION',
      url: '/accommodation',
      icon: 'hotel',
      render: of(true),
    },
    {
      title: 'PACKING_LIST',
      url: '/packing-list',
      icon: 'work',
      render: of(true),
    },
    { title: 'FAQ', url: '/faq', icon: 'chatbubbles', render: of(true) },
    {
      title: 'STAFF_INFORMATION',
      url: '/guides',
      icon: 'contacts',
      render: of(true),
    },
  ];

  public teacherPages = [
    { title: 'PARTICIPANT_INFORMATION', url: '/participants', icon: 'groups' },
    { title: 'NOTE_TO_TEACHER', url: '/teacher-note', icon: 'note' },
    { title: 'VIEW_FEEDBACK', url: '/feedback', icon: 'rate_review' },
  ];

  public policyPages = [
    {
      title: 'INFECTIOUS_DISEASE_SAFETY',
      url: '/covid-policy',
      icon: 'coronavirus',
      render: of(true),
    },
    {
      title: 'CHILD_SAFEGUARDING',
      url: '/child-protection',
      icon: 'security',
      render: of(true),
    },
    {
      title: 'PRIVACY_POLICY',
      url: '/privacy-policy',
      icon: 'policy',
      render: of(true),
    },
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService,
    private logger: NGXLogger,
    private routeStateService: RouteStateService,
    private router: Router,
    public auth: AuthService,
    public paymentService: PaymentService,
    public studentService: StudentService,
    public tripSwitcher: TripSwitcherService,
    public tripService: TripService
  ) {
    this.initTranslate();
    router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && a instanceof NavigationEnd)
      )
      .subscribe((_) => {
        if (this.drawer.opened) {
          this.drawer.close();
        }
      });
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
      if (browserLang.includes('zh')) {
        this.translate.use('zh-cmn-Hans');
        // No support for Hant currently
        // const browserCultureLang = this.translate.getBrowserCultureLang();
        // if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
        //   this.translate.use('zh-cmn-Hans');
        // } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
        //   this.translate.use('zh-cmn-Hant');
        // }
      } else {
        this.translate.use(browserLang);
      }
    } else {
      this.translate.use('en');
    }

    this.logger.debug(
      `TranslateService language set to "${this.translate.currentLang}"`
    );
  }

  /** Logout the current application user */
  async logout() {
    const username = this.auth.getCredentials()?.username;
    try {
      await this.auth.logout();
      // paymentService.logout();
      this.tripSwitcher.logout();
      this.logger.debug(`User ${username} logged out`);
      this.router.navigateByUrl('/login');
    } catch (error) {
      this.logger.warn('AppComponent error logging out', error);
    }
  }
}
