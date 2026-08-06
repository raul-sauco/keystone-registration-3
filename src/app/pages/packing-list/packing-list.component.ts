import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { MarkdownComponent } from 'ngx-markdown';

import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { PackingListItemComponent } from '@components/packing-list-item/packing-list-item.component';
import { PackingListService } from '@services/packing-list/packing-list.service';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatIcon,
    PackingListItemComponent,
    LoadingSpinnerContentComponent,
    MarkdownComponent,
    TranslatePipe,
  ],
})
export class PackingListComponent {
  packingListService = inject(PackingListService);
}
