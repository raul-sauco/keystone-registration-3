import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { AdminBannerComponent } from '../../components/admin-banner/admin-banner.component';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { FeedbackPieChartComponent } from '../../components/feedback-pie-chart/feedback-pie-chart.component';
import { NoItemsNotificationComponent } from '../../components/no-items-notification/no-items-notification.component';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgIf,
        AdminBannerComponent,
        MatTabGroup,
        MatTab,
        NgFor,
        FeedbackPieChartComponent,
        NoItemsNotificationComponent,
        LoadingSpinnerContentComponent,
        AsyncPipe,
        TranslatePipe,
    ],
})
export class FeedbackComponent implements OnInit {
  private logger = inject(NGXLogger);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private tripSwitcher = inject(TripSwitcherService);

  feedback$!: Observable<any>;
  canDetermineTrip = true;

  ngOnInit(): void {
    this.logger.debug('FeedbackComponent OnInit');
    if (
      this.auth.authenticated &&
      this.auth.getAccessToken() &&
      (this.auth.isSchoolAdmin || this.auth.isTeacher)
    ) {
      if (this.auth.isSchoolAdmin) {
        if (this.tripSwitcher.selectedTrip) {
          this.fetch(this.tripSwitcher.selectedTrip.id);
        } else {
          this.canDetermineTrip = false;
          this.logger.debug('FeedbackComponent cannot determine trip');
          this.setEmptyContent();
        }
      } else {
        this.fetch();
      }
    } else {
      this.logger.error(
        'Called FeedbackComponent OnInit without valid ' +
        'authentication status. AuthGuard failure?',
        this.auth.getCredentials()
      );
      this.setEmptyContent();
    }
  }

  /**
   * Set the component content to an empty result set to display correctly.
   */
  protected setEmptyContent(): void {
    this.feedback$ = of({
      count: 0,
      charts: [],
      questions: [],
    });
  }

  /**
   * Subscribe to the ApiService to get feedback data
   */
  fetch(tripId?: number): void {
    this.logger.debug('FeedbackComponent fetch() called');
    const endpoint = tripId ? `feedbacks?trip-id=${tripId}` : 'feedbacks';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getAccessToken(),
      }),
    };
    this.feedback$ = this.api.get(endpoint, null, options);
  }
}
