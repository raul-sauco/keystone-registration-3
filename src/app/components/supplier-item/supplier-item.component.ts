import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { Supplier } from '@models/supplier';
import { GlobalsService } from '@services/globals/globals.service';
import { LocalizationService } from '@services/localization/localization.service';

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
export class SupplierItemComponent {
  private readonly globals = inject(GlobalsService);
  private readonly localization = inject(LocalizationService);

  readonly isChinese = this.localization.isChinese;
  readonly url = this.globals.getResUrl();

  @Input() supplier!: Supplier;
}
