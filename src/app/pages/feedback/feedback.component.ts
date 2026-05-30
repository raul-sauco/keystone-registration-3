import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { AdminBannerComponent } from '../../components/admin-banner/admin-banner.component';
import { FeedbackPieChartComponent } from '../../components/feedback-pie-chart/feedback-pie-chart.component';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';
import { NoItemsNotificationComponent } from '../../components/no-items-notification/no-items-notification.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    AdminBannerComponent,
    MatTabGroup,
    MatTab,
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

  feedback$!: Observable<any>;
  canDetermineTrip = true;

  ngOnInit(): void {
    this.logger.debug('FeedbackComponent OnInit');
    // Guard checks auth
    this.fetch();
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
  fetch(): void {
    this.logger.debug('FeedbackComponent fetch() called');
    this.feedback$ = this.api.get('feedbacks');
  }
}
