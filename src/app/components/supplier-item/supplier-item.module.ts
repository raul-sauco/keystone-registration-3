import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SupplierItemComponent } from './supplier-item.component';

@NgModule({
  declarations: [SupplierItemComponent],
  exports: [SupplierItemComponent],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
})
export class SupplierItemModule {}
