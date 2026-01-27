import { Component, OnInit, Input, inject } from '@angular/core';
import { TripPackingListItem } from 'src/app/models/tripPackingListItem';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { MarkdownComponent, MarkdownPipe } from 'ngx-markdown';

@Component({
    selector: 'app-packing-list-item',
    templateUrl: './packing-list-item.component.html',
    styleUrls: ['./packing-list-item.component.scss'],
    imports: [MarkdownComponent, AsyncPipe, TitleCasePipe, MarkdownPipe]
})
export class PackingListItemComponent implements OnInit {
  private globals = inject(GlobalsService);

  @Input() pli!: TripPackingListItem;
  url!: string;

  ngOnInit(): void {
    this.url = this.globals.getResUrl();
  }
}
