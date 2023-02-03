import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { NoItemsNotificationModule } from 'src/app/components/no-items-notification/no-items-notification.module';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    AdminBannerModule,
    CommonModule,
    FeedbackRoutingModule,
    LoadingSpinnerContentModule,
    NoItemsNotificationModule,
    TranslateModule,
    MatIconModule,
    MatTabsModule,
    NgxChartsModule,
  ],
})
export class FeedbackModule {}
