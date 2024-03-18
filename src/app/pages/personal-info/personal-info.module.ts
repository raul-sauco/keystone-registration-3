import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';

import { LoadingSpinnerContentModule } from '@components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from '@components/login-required-message/login-required-message.module';
import { IdPhotoComponent } from './id-photo/id-photo.component';
import { PersonalInfoRoutingModule } from './personal-info-routing.module';
import { PersonalInfoComponent } from './personal-info.component';

@NgModule({
  declarations: [PersonalInfoComponent],
  imports: [
    CommonModule,
    FormsModule,
    IdPhotoComponent,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MarkdownModule,
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
