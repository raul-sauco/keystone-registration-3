import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MarkdownComponent, MarkdownPipe } from 'ngx-markdown';

import { TripPackingListItem } from '@models/tripPackingListItem';
import { GlobalsService } from '@services/globals/globals.service';

@Component({
  selector: 'app-packing-list-item',
  templateUrl: './packing-list-item.component.html',
  styleUrls: ['./packing-list-item.component.scss'],
  imports: [MarkdownComponent, AsyncPipe, TitleCasePipe, MarkdownPipe],
})
export class PackingListItemComponent implements OnInit {
  private globals = inject(GlobalsService);

  public imageBase: string = '';

  @Input() pli!: TripPackingListItem;

  ngOnInit() {
    // Calculate it once when the component starts
    this.imageBase = `${this.globals.getResUrl()}img/packlist/${this.pli.getImage()}`;
  }
}
