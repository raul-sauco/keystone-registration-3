import { inject, Service, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { HttpErrorResponse } from '@angular/common/http';
import { CredentialsJson } from '@app/models/credentials';
import { InvalidTripCodeError, ServerUnavailableError } from '@app/models/error';
import { TripCodes } from '@models/tripCodes';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';

interface RegistrationResponseJson {
  error: boolean;
  message: string;
  access_token: string;
  credentials: CredentialsJson;
}

@Service()
export class RegistrationService {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);
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

  async submitUserRegistration(
    id: string,
    name: string,
    dob: string,
    password: string,
  ): Promise<void> {
    const params = {
      id,
      name,
      dob,
      password,
      tripId: this.tripCodes()?.tripId,
      code: this.tripCodes()?.code,
    };
    try {
      const response = await this.api.postAsync<RegistrationResponseJson>('r', params);
      this.auth.setAccessToken(response.access_token);
      this.auth.setCredentials(response);
    } catch (err) {
      this.logger.error('RegistrationService: Error submitting registration', err);

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
