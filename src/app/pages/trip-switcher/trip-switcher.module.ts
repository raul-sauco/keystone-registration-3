import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { TripSwitcherRoutingModule } from './trip-switcher-routing.module';
import { TripSwitcherComponent } from './trip-switcher.component';

@NgModule({
  declarations: [TripSwitcherComponent],
  imports: [
    CommonModule,
    LoadingSpinnerContentModule,
    TranslateModule,
    TripSwitcherRoutingModule,
  ],
})
export class TripSwitcherModule {}
