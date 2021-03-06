import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { NoItemsNotificationModule } from 'src/app/components/no-items-notification/no-items-notification.module';


@NgModule({
  declarations: [DocumentsComponent],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    NoItemsNotificationModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ]
})
export class DocumentsModule { }
