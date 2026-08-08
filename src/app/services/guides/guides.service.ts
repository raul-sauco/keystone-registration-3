import { computed, inject, resource, Service } from '@angular/core';

import { Guide, GuideJson } from '@models/guide';
import { ApiService } from '../api/api.service';

@Service()
export class GuidesService {
  private readonly api = inject(ApiService);

  readonly guidesResource = resource({
    loader: async () => {
      const guidesJson = await this.api.getAsync<GuideJson[]>('guides');
      return guidesJson.map(Guide.fromJson);
    },
  });

  readonly guides = computed(() =>
    (this.guidesResource.value() ?? []).toSorted((a, b) => a.nameEn.localeCompare(b.nameEn)),
  );
}
