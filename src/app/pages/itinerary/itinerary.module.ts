import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItineraryRoutingModule } from './itinerary-routing.module';
import { ItineraryComponent } from './itinerary.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [ItineraryComponent],
  imports: [
    CommonModule,
    ItineraryRoutingModule,
    LoadingSpinnerContentModule,
    MatListModule,
    MatTabsModule
  ]
})
export class ItineraryModule { }
