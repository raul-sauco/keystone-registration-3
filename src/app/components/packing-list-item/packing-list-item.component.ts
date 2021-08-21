import { Component, OnInit, Input } from '@angular/core';
import { TripPackingListItem } from 'src/app/models/tripPackingListItem';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-packing-list-item',
  templateUrl: './packing-list-item.component.html',
  styleUrls: ['./packing-list-item.component.scss'],
})
export class PackingListItemComponent implements OnInit {
  @Input() pli: TripPackingListItem;
  url: string;

  constructor(private globals: GlobalsService) {}

  ngOnInit(): void {
    this.url = this.globals.getResUrl();
  }
}
