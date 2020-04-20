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
    MarkdownModule.forChild()
  ]
})
export class PackingListModule { }
