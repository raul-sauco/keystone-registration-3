import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackingListItemComponent } from './packing-list-item.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [PackingListItemComponent],
  exports: [PackingListItemComponent],
  imports: [
    CommonModule,
    MarkdownModule
  ]
})
export class PackingListItemModule { }
