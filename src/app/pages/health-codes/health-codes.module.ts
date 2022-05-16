import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HealthCodesRoutingModule } from './health-codes-routing.module';
import { HealthCodesComponent } from './health-codes.component';

@NgModule({
  declarations: [HealthCodesComponent],
  imports: [CommonModule, HealthCodesRoutingModule, TranslateModule],
})
export class HealthCodesModule {}
