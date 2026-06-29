import { inject, Service, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { HttpErrorResponse } from '@angular/common/http';
import { InvalidTripCodeError, ServerUnavailableError } from '@app/models/error';
import { TripCodes } from '@models/tripCodes';
import { ApiService } from '../api/api.service';

@Service()
export class RegistrationService {
  api = inject(ApiService);
  logger = inject(NGXLogger);
  private _tripCodes = signal<TripCodes | null>(null);
  readonly tripCodes = this._tripCodes.asReadonly();

  /**
   * Validate trip codes entered by the user. Either returns or throws an error
   */
  async validateCodes(id: number, code: number, lang: string): Promise<void> {
    try {
      const response = await this.api.postAsync<TripCodes>('trip-codes', { id, code, lang });
      this.logger.debug('RegistrationService: Got TripCodes from API', response);
      this._tripCodes.set(response);
    } catch (err) {
      this.logger.error('RegistrationService: Error validating codes', err);

      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          throw new InvalidTripCodeError();
        }
        if (err.status === 500 || err.status === 0) {
          throw new ServerUnavailableError();
        }
      }

      throw err;
    }
  }
}
