import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccommodationRoutingModule } from './accommodation-routing.module';
import { AccommodationComponent } from './accommodation.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from './../../components/login-required-message/login-required-message.module';
import { SupplierItemModule } from './../../components/supplier-item/supplier-item.module';

@NgModule({
  declarations: [AccommodationComponent],
  imports: [
    CommonModule,
    AccommodationRoutingModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    SupplierItemModule,
  ],
})
export class AccommodationModule {}
