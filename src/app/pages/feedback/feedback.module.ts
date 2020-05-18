import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NoItemsNotificationModule } from 'src/app/components/no-items-notification/no-items-notification.module';


@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    LoadingSpinnerContentModule,
    NoItemsNotificationModule,
    TranslateModule,
    MatIconModule,
    MatTabsModule,
    NgxChartsModule
  ]
})
export class FeedbackModule { }
