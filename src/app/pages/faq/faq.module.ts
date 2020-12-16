import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent, PostQaDialogComponent } from './faq.component';

import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { NoItemsNotificationModule } from 'src/app/components/no-items-notification/no-items-notification.module';

@NgModule({
  declarations: [FaqComponent, PostQaDialogComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    FormsModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    NoItemsNotificationModule,
    TranslateModule,
  ],
})
export class FaqModule {}
