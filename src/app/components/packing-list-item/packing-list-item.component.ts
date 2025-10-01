import { Component, OnInit, Input, inject } from '@angular/core';
import { TripPackingListItem } from 'src/app/models/tripPackingListItem';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
    selector: 'app-packing-list-item',
    templateUrl: './packing-list-item.component.html',
    styleUrls: ['./packing-list-item.component.scss'],
    standalone: false
})
export class PackingListItemComponent implements OnInit {
  private globals = inject(GlobalsService);

  @Input() pli!: TripPackingListItem;
  url!: string;

  ngOnInit(): void {
    this.url = this.globals.getResUrl();
  }
}
