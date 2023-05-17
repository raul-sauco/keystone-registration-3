import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';

import { RegisterRoutingModule } from './register-routing.module';
import {
  ErrorMessageDialogComponent,
  RegisterComponent,
  RegistrationSuccessDialogComponent,
} from './register.component';

@NgModule({
  declarations: [
    RegisterComponent,
    ErrorMessageDialogComponent,
    RegistrationSuccessDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MarkdownModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    TranslateModule,
  ],
})
export class RegisterModule {}
