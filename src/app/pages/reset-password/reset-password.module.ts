import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
