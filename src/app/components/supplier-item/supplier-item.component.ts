import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Supplier } from '@models/supplier';
import { GlobalsService } from '@services/globals/globals.service';

@Component({
  selector: 'app-supplier-item',
  templateUrl: './supplier-item.component.html',
  styleUrls: ['./supplier-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    MatIcon,
    TranslatePipe,
  ],
})
export class SupplierItemComponent implements OnInit {
  private globals = inject(GlobalsService);
  translate = inject(TranslateService);

  @Input() supplier!: Supplier;
  url!: string;
  lang!: string;

  ngOnInit(): void {
    this.url = this.globals.getResUrl();
    this.lang = this.translate.getCurrentLang()?.includes('zh') ? 'zh' : 'en';
  }
}
