import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule, UpperCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { filter, map, Observable, of, shareReplay, withLatestFrom } from 'rxjs';

import { AdminBannerModule } from '@components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { AuthState } from '@models/auth-state';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { StudentService } from '@services/student/student.service';
import { TripService } from '@services/trip/trip.service';

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
  private router = inject(Router);
  private api = inject(ApiService);
  auth = inject(AuthService);
  paymentService = inject(PaymentService);
  studentService = inject(StudentService);
  tripService = inject(TripService);
  // Expose the enum to the template, otherwise not available
  AuthState = AuthState;

  @ViewChild('drawer', { static: true })
  drawer!: MatSidenav;
  title = 'Keystone Adventures';
  tripId$!: Observable<string | null>;
  tripId: string | null = null;
  enableFullNavigation$!: Observable<boolean>;

  // TODO: Cleanup moving pages to a separate file
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

  // TODO: Review if this is the best way to work the drawer currently
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  ngOnInit() {
    this.initTranslate();
    this.router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(([a, b]) => b && a instanceof NavigationEnd),
      )
      .subscribe(() => {
        if (this.drawer.opened) {
          this.drawer.close();
        }
      });
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
    this.logger.debug(`TranslateService language set to "${this.translate.getCurrentLang()}"`);
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
    if (this.auth.authenticated()) {
      // Set the user's preference in the backend, 1 => en, 2 => zh.
      this.api.patch('user-preferences/1', { value }).subscribe({
        next: (res) => this.logger.debug(res),
        error: (err) => this.logger.warn(err),
      });
    }
  }

  /**
   * Computed signal to determine whether to let the user navigate to routes
   * that should only be accessible after completing the registration steps
   */
  readonly enableFullNavigation = computed(() => {
    this.logger.debug('AppComponent: computing enableFullNavigation');
    if (!this.auth.authenticated()) {
      return false;
    }

    const student = this.studentService.student();
    if (!student) {
      return false;
    }

    const paymentInfo = this.paymentService.paymentInfo.value();
    if (!paymentInfo) {
      return false;
    }

    if (!student.waiverAccepted) {
      return false;
    }

    if (this.auth.isStudentSignal() && paymentInfo.required && !paymentInfo.paid) {
      return false;
    }

    return true;
  });

  /** Logout the current application user */
  async logout() {
    const username = this.auth.credentialsSignal()?.username;
    try {
      this.logger.debug(`Logging out user ${username}`);
      await this.auth.logout();
      this.router.navigateByUrl('/login');
    } catch (error) {
      this.logger.warn('AppComponent error logging out', error);
    }
  }
}
