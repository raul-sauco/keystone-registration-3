import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
