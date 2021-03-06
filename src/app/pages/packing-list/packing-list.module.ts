import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackingListRoutingModule } from './packing-list-routing.module';
import { PackingListComponent } from './packing-list.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';

import { PackingListItemModule } from 'src/app/components/packing-list-item/packing-list-item.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';


@NgModule({
  declarations: [PackingListComponent],
  imports: [
    CommonModule,
    PackingListRoutingModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    PackingListItemModule,
    TranslateModule,
    MarkdownModule.forChild(),
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule
  ]
})
export class PackingListModule { }
