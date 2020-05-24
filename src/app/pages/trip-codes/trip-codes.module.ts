import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripCodesRoutingModule } from './trip-codes-routing.module';
import { TripCodesComponent, CodeErrorDialogComponent, TripCodeHelpDialogComponent } from './trip-codes.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    TripCodesComponent,
    CodeErrorDialogComponent,
    TripCodeHelpDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TripCodesRoutingModule,
    LoadingSpinnerContentModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    TranslateModule
  ]
})
export class TripCodesModule { }
