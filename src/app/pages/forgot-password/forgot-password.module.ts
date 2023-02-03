import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

import { TranslateModule } from '@ngx-translate/core';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import {
  ForgotPasswordComponent,
  ForgotPasswordDialogComponent,
} from './forgot-password.component';

@NgModule({
  declarations: [ForgotPasswordComponent, ForgotPasswordDialogComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ForgotPasswordModule {}
