import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import {
  RegisterComponent,
  ErrorMessageDialogComponent,
  RegistrationSuccessDialogComponent
} from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    RegisterComponent,
    ErrorMessageDialogComponent,
    RegistrationSuccessDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    TranslateModule
  ]
})
export class RegisterModule { }
