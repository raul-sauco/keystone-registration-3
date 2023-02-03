import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { TranslateModule } from '@ngx-translate/core';

import { TripCodesRoutingModule } from './trip-codes-routing.module';
import {
  TripCodesComponent,
  CodeErrorDialogComponent,
  TripCodeHelpDialogComponent,
} from './trip-codes.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';

@NgModule({
  declarations: [
    TripCodesComponent,
    CodeErrorDialogComponent,
    TripCodeHelpDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TripCodesRoutingModule,
    LoadingSpinnerContentModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    TranslateModule,
  ],
})
export class TripCodesModule {}
