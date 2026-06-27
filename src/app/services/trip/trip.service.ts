import { Injectable, computed, inject, resource } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { Trip, TripJson } from '@models/trip';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);

  readonly tripResource = resource({
    // null if not authenticated
    params: () => this.auth.credentialsSignal(),
    loader: async ({ params: credentials }) => {
      if (credentials === null) {
        this.logger.debug('TripService: No credentials, not loading trip');
        return null;
      }
      const tripJson = await this.api.getAsync<TripJson>('my-trip', { expand: 'name_zh,name_en' });
      const trip = Trip.fromJson(tripJson);
      this.logger.debug('TripService: Got trip from server', trip);
      return trip;
    },
  });

  /** Current trip, or null if unauthenticated. Use tripResource for loading/error state. */
  readonly trip = computed(() => this.tripResource.value());
}
