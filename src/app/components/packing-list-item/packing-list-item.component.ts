import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

import { PackingListItem } from '@models/packingListItem';
import { GlobalsService } from '@services/globals/globals.service';
import { LocalizationService } from '@services/localization/localization.service';

@Component({
  selector: 'app-packing-list-item',
  templateUrl: './packing-list-item.component.html',
  styleUrls: ['./packing-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent, TitleCasePipe],
})
export class PackingListItemComponent implements OnInit {
  private globals = inject(GlobalsService);
  private localization = inject(LocalizationService);

  readonly language = this.localization.currentLanguage;

  imageBase = '';

  @Input() pli!: PackingListItem;

  ngOnInit() {
    // Calculate it once when the component starts
    this.imageBase = `${this.globals.getResUrl()}img/packlist/${this.pli.getImage()}`;
  }
}
