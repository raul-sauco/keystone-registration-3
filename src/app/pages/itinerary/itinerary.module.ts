import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItineraryRoutingModule } from './itinerary-routing.module';
import { ItineraryComponent } from './itinerary.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [ItineraryComponent],
  imports: [
    AdminBannerModule,
    CommonModule,
    ItineraryRoutingModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MatListModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
})
export class ItineraryModule {}
