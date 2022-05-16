import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { HealthCodesRoutingModule } from './health-codes-routing.module';
import { HealthCodesComponent } from './health-codes.component';

@NgModule({
  declarations: [HealthCodesComponent],
  imports: [
    CommonModule,
    HealthCodesRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule,
  ],
})
export class HealthCodesModule {}
