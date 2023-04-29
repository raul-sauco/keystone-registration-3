import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';

import { FeedbackPieChartComponent } from './feedback-pie-chart.component';

@NgModule({
  declarations: [FeedbackPieChartComponent],
  exports: [FeedbackPieChartComponent],
  imports: [CommonModule, NgChartsModule],
})
export class FeedbackPieChartModule {}
