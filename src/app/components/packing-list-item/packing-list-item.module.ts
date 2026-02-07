import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackingListItemComponent } from './packing-list-item.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  exports: [PackingListItemComponent],
  imports: [CommonModule, MarkdownModule, PackingListItemComponent],
})
export class PackingListItemModule {}
