import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

import { AdminBannerModule } from '@components/admin-banner/admin-banner.module';
import { FeedbackPieChartModule } from '@components/feedback-pie-chart/feedback-pie-chart.module';
import { LoadingSpinnerContentModule } from '@components/loading-spinner-content/loading-spinner-content.module';
import { NoItemsNotificationModule } from '@components/no-items-notification/no-items-notification.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    AdminBannerModule,
    CommonModule,
    FeedbackPieChartModule,
    FeedbackRoutingModule,
    LoadingSpinnerContentModule,
    NoItemsNotificationModule,
    TranslateModule,
    MatIconModule,
    MatTabsModule,
  ],
})
export class FeedbackModule {}
