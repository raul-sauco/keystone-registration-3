import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { NoResultsModule } from 'src/app/components/no-results/no-results.module';
import { SupplierItemModule } from 'src/app/components/supplier-item/supplier-item.module';
import { AccommodationRoutingModule } from './accommodation-routing.module';
import { AccommodationComponent } from './accommodation.component';

@NgModule({
  declarations: [AccommodationComponent],
  imports: [
    AdminBannerModule,
    CommonModule,
    AccommodationRoutingModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    NoResultsModule,
    SupplierItemModule,
  ],
})
export class AccommodationModule {}
