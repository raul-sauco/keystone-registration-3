import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule, UpperCasePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { MarkdownModule } from 'ngx-markdown';
import { Observable, combineLatest, of } from 'rxjs';
import {
  delay,
  filter,
  map,
  shareReplay,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';

import { AdminBannerModule } from '@components/admin-banner/admin-banner.module';
import { AuthState } from '@models/auth-state';
import { PaymentInfo } from '@models/paymentInfo';
import { Student } from '@models/student';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { RouteStateService } from '@services/route-state/route-state.service';
import { StudentService } from '@services/student/student.service';
import { TripSwitcherService } from '@services/trip-switcher/trip-switcher.service';
import { TripService } from '@services/trip/trip.service';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    AdminBannerModule,
    AsyncPipe,
    CommonModule,
    LayoutModule,
    LoadingSpinnerContentComponent,
    LoggerModule,
    MarkdownModule,
    MatToolbarModule,
    MatBadgeModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterOutlet,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class AppComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  translate = inject(TranslateService);
  private logger = inject(NGXLogger);
  private routeStateService = inject(RouteStateService);
  private router = inject(Router);
  private api = inject(ApiService);
  auth = inject(AuthService);
  paymentService = inject(PaymentService);
  studentService = inject(StudentService);
  tripSwitcher = inject(TripSwitcherService);
  tripService = inject(TripService);
  eAuthState = AuthState;

  @ViewChild('drawer', { static: true })
  drawer!: MatSidenav;
  title = 'Keystone Adventures';
  tripId$!: Observable<string | null>;
  tripId: string | null = null;
  enableFullNavigation$!: Observable<boolean>;

  public appPages = [
    {
      title: 'ITINERARY',
      url: '/program-overview',
      icon: 'preview',
      render: of(true),
    },
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
      title: 'INFECTIOUS_DISEASE_POLICY',
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
      shareReplay(),
    );

  ngOnInit() {
    this.checkAuth();
    this.initTranslate();
    this.router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && a instanceof NavigationEnd),
      )
      .subscribe((_) => {
        if (this.drawer.opened) {
          this.drawer.close();
        }
      });
    // Subscribe to the routeStateService to get updates on the trip ID parameter
    this.tripId$ = this.routeStateService.tripIdParam$.pipe(delay(0));
    this.setEnableFullNavigationObserver();
  }

  /**
   * Access token is only stored in-memory, check status when the app
   * first launches, for example page refresh.
   */
  checkAuth() {
    this.logger.debug('AppComponent::ngOnInit triggered authentication status check');
    this.auth.auth$.subscribe({
      next: (state: AuthState) => {
        this.logger.debug(`AppComponent auth$ updated to ${state}`);
        if (state === AuthState.Authenticated) {
          this.studentService.init();
        }
      },
    });
    this.api.get('auth/check').subscribe();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setFallbackLang('en');
    const browserLang = this.translate.getBrowserLang();
    if (browserLang) {
      if (browserLang.includes('zh')) {
        this.translate.use('zh-cmn-Hans');
      } else {
        this.translate.use(browserLang);
      }
    } else {
      this.translate.use('en');
    }
    this.logger.debug(
      `TranslateService language set to "${this.translate.getCurrentLang()}"`,
    );
  }

  toggleLanguage() {
    this.logger.debug('AppComponent.toggleLanguage');
    let value = 1;
    if (this.translate.getCurrentLang() === 'en') {
      value = 2;
      this.translate.use('zh-cmn-Hans');
    } else {
      this.translate.use('en');
    }
    if (this.auth.authenticated) {
      // Set the user's preference in the backend, 1 => en, 2 => zh.
      this.api.patch('user-preferences/1', { value }).subscribe({
        next: (res: any) => this.logger.debug(res),
        error: (err: any) => this.logger.warn(err),
      });
    }
  }

  /**
   * Set a combine latest observer that uses multiple different observers to determine if the app
   * should let the user navigate to all pages or only a restricted set.
   */
  setEnableFullNavigationObserver() {
    this.logger.debug('AppComponent.setEnableFullNavigationObserver');
    // Combined observable from several sources.
    this.enableFullNavigation$ = combineLatest(
      [
        this.studentService.student$.pipe(startWith(null)),
        this.paymentService.paymentInfo$.pipe(startWith(null)),
        this.auth.auth$,
      ],
      (
        student: Student | null,
        paymentInfo: PaymentInfo | null,
        authState: AuthState,
      ) => {
        if (authState !== AuthState.Authenticated
          || student === null
          || paymentInfo === null
          || !student.waiverAccepted
          || (this.auth.isStudent && paymentInfo.required && !paymentInfo.paid)) {
          this.logger.debug('AppComponent: Blocking full navigation');
          return false;
        }
        this.logger.debug('AppComponent: Allowing full navigation');
        return true;
      },
    );
  }

  /** Logout the current application user */
  logout() {
    try {
      this.logger.debug(`Logging out user ${this.auth.credentials?.username}`);
      this.auth.logout();
      this.router.navigateByUrl('/login');
    } catch (error) {
      this.logger.warn('AppComponent error logging out', error);
    }
  }
}
