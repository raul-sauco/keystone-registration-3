import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkdownPipe } from 'ngx-markdown';

import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { PackingListItemComponent } from '@components/packing-list-item/packing-list-item.component';
import { PackingListService } from '@services/packing-list/packing-list.service';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss'],
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatIcon,
    PackingListItemComponent,
    LoadingSpinnerContentComponent,
    TranslatePipe,
    MarkdownPipe,
  ],
})
export class PackingListComponent {
  packingListService = inject(PackingListService);
  sanitizer = inject(DomSanitizer);

  needsLogin = false;
  fetching = false;

  // Sort the arrays by the item's order property
  // [this.itemsBring, this.itemsOptional, this.itemsDoNotBring].forEach(
  //   (array: TripPackingListItem[]) => {
  //     array.sort(
  //       (a: TripPackingListItem, b: TripPackingListItem) =>
  //         (a.getOrder() || 0) - (b.getOrder() || 0),
  //     );
  //   },
  // );
}
