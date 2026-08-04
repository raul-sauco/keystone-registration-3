import { Injectable, computed, inject, resource } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { PackingListItem, PackingListItemJson } from '@app/models/packingListItem';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class PackingListService {
  private api = inject(ApiService);
  private logger = inject(NGXLogger);

  readonly itemsResource = resource({
    loader: async () => {
      this.logger.debug('Loading Packing List Items');
      const json = await this.api.getAsync<PackingListItemJson[]>('trip-packing-list-items');
      return json.map((json) => {
        return PackingListItem.fromJson(json);
      });
    },
  });

  readonly itemsBring = computed(() =>
    this.itemsResource
      .value()
      ?.filter((item) => item.bring === 0)
      .toSorted((a, b) => a.order - b.order),
  );

  readonly itemsOptional = computed(() =>
    this.itemsResource.value()?.filter((item) => item.bring === 1),
  );

  readonly itemsDoNotBring = computed(() =>
    this.itemsResource.value()?.filter((item) => item.bring === 2),
  );
}
