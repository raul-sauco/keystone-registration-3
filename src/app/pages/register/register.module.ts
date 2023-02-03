import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { TranslateModule } from '@ngx-translate/core';
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
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    TranslateModule,
  ],
})
export class RegisterModule {}
