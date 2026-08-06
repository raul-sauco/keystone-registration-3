import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { NoResultsComponent } from '@components/no-results/no-results.component';
import { SupplierItemComponent } from '@components/supplier-item/supplier-item.component';
import { Supplier, SupplierJson } from '@models/supplier';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SupplierItemComponent,
    NoResultsComponent,
    LoadingSpinnerContentComponent,
    TranslatePipe,
  ],
})
export class AccommodationComponent {
  private api = inject(ApiService);
  private logger = inject(NGXLogger);

  readonly suppliersResource = resource({
    loader: async () => {
      this.logger.debug('AccommodationService loading supplier json');
      const json = await this.api.getAsync<SupplierJson[]>('accommodation');
      return json.map((json) => Supplier.fromJson(json));
    },
  });

  readonly suppliers = computed(() => this.suppliersResource.value() ?? []);
}
