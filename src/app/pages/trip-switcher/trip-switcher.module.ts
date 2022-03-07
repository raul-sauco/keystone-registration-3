import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripSwitcherRoutingModule } from './trip-switcher-routing.module';
import { TripSwitcherComponent } from './trip-switcher.component';

@NgModule({
  declarations: [TripSwitcherComponent],
  imports: [CommonModule, TranslateModule, TripSwitcherRoutingModule],
})
export class TripSwitcherModule {}
