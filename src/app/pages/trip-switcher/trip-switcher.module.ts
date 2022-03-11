import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { TripSwitcherRoutingModule } from './trip-switcher-routing.module';
import { TripSwitcherComponent } from './trip-switcher.component';

@NgModule({
  declarations: [TripSwitcherComponent],
  imports: [
    CommonModule,
    LoadingSpinnerContentModule,
    MatRippleModule,
    TranslateModule,
    TripSwitcherRoutingModule,
  ],
})
export class TripSwitcherModule {}
