import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRequiredMessageComponent } from './login-required-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginRequiredMessageComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    TranslateModule
  ],
  exports: [LoginRequiredMessageComponent]
})
export class LoginRequiredMessageModule { }
