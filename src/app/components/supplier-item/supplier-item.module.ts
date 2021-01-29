import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { SupplierItemComponent } from './supplier-item.component';

@NgModule({
  declarations: [SupplierItemComponent],
  exports: [SupplierItemComponent],
  imports: [CommonModule, MatCardModule],
})
export class SupplierItemModule {}
