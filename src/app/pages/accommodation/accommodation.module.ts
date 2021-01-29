import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccommodationRoutingModule } from './accommodation-routing.module';
import { AccommodationComponent } from './accommodation.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { SupplierItemModule } from './../../components/supplier-item/supplier-item.module';

@NgModule({
  declarations: [AccommodationComponent],
  imports: [
    CommonModule,
    AccommodationRoutingModule,
    LoadingSpinnerContentModule,
    SupplierItemModule,
  ],
})
export class AccommodationModule {}
