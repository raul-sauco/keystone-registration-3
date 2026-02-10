import { Injectable, inject, resource } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { School } from '@models/school';
import { ApiService } from '@services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private api = inject(ApiService);
  private logger = inject(NGXLogger);

  readonly school = resource({
    loader: async () => {
      this.logger.debug('SchoolService: Fetching school data...');
      const data = await this.api.getAsync('school-details');
      return new School(data as any);
    },
  });
}
