import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

import { TranslateModule } from '@ngx-translate/core';

import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import {
  ResetPasswordComponent,
  ResetPasswordDialogComponent,
} from './reset-password.component';

@NgModule({
  declarations: [ResetPasswordComponent, ResetPasswordDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerContentModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    ResetPasswordRoutingModule,
    TranslateModule,
  ],
})
export class ResetPasswordModule {}
