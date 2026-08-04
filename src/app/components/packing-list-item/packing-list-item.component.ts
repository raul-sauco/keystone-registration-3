import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MarkdownComponent, MarkdownPipe } from 'ngx-markdown';

import { PackingListItem } from '@app/models/packingListItem';
import { GlobalsService } from '@services/globals/globals.service';

@Component({
  selector: 'app-packing-list-item',
  templateUrl: './packing-list-item.component.html',
  styleUrls: ['./packing-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent, TitleCasePipe, MarkdownPipe],
})
export class PackingListItemComponent implements OnInit {
  private globals = inject(GlobalsService);
  private translate = inject(TranslateService);

  public imageBase = '';

  readonly language = computed(() => this.translate.getCurrentLang());

  @Input() pli!: PackingListItem;

  ngOnInit() {
    // Calculate it once when the component starts
    this.imageBase = `${this.globals.getResUrl()}img/packlist/${this.pli.getImage()}`;
  }
}
