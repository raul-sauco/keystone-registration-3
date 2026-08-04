import { Injectable, computed, inject, resource } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { TripPackingListItem } from '@models/tripPackingListItem';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class PackingListService {
  private api = inject(ApiService);
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);

  readonly itemsResource = resource({
    loader: async () => {
      this.logger.debug('Loading Packing List Items');
      const json = await this.api.getAsync<any[]>('trip-packing-list-items', { expand: 'item' });
      return json.map((data) => {
        console.log(data);
        data.lang = this.translate.getCurrentLang();
        return new TripPackingListItem(data);
      });
    },
  });

  readonly itemsBring = computed(() =>
    this.itemsResource.value()?.filter((item) => item.bring === 0),
  );

  readonly itemsOptional = computed(() =>
    this.itemsResource.value()?.filter((item) => item.bring === 1),
  );

  readonly itemsDoNotBring = computed(() =>
    this.itemsResource.value()?.filter((item) => item.bring === 2),
  );
}
