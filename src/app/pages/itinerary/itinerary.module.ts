import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { TranslateModule } from '@ngx-translate/core';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { NoResultsModule } from 'src/app/components/no-results/no-results.module';
import { ItineraryRoutingModule } from './itinerary-routing.module';
import { ItineraryComponent } from './itinerary.component';

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
    NoResultsModule,
    TranslateModule,
  ],
})
export class ItineraryModule {}
