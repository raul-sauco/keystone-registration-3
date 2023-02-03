import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { PersonalInfoRoutingModule } from './personal-info-routing.module';
import { PersonalInfoComponent } from './personal-info.component';

@NgModule({
  declarations: [PersonalInfoComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatSelectModule,
    MatSnackBarModule,
    PersonalInfoRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class PersonalInfoModule {}
