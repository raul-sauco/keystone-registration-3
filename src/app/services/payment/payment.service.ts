import { Injectable, inject, resource } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { Image, ImageJson } from '@models/image';
import { PaymentInfo, PaymentInfoJson } from '@models/paymentInfo';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);

  private readonly authParams = () => {
    if (!this.auth.authenticated()) {
      return null;
    }
    return {};
  };

  /**
   * Utitily function to reload all service data with one call, no need for the
   * callers to know what data needs to be loaded
   */
  reload(): void {
    this.paymentInfo.reload();
    this.paymentProofs.reload();
  }

  readonly paymentInfo = resource({
    params: this.authParams,
    loader: async () => {
      this.logger.debug('PaymentService: Fetching PaymentInfo');
      try {
        const data = await this.api.getAsync<PaymentInfoJson>(
          'payment-info/' + this.auth.credentials?.studentId,
        );
        const paymentInfo = new PaymentInfo(data);
        this.logger.debug('PaymentService: Got PaymentInfo from server', paymentInfo);
        return paymentInfo;
      } catch (err: any) {
        this.logger.error(
          'PaymentService: Error fetching payment info',
          err,
          this.auth.credentials,
        );
        throw err;
      }
    },
  });

  readonly paymentProofs = resource({
    params: this.authParams,
    loader: async () => {
      this.logger.debug('PaymentService: Fetching PaymentProofs');
      try {
        const data = await this.api.getAsync<ImageJson[]>('trip-direct-payment-proof?expand=image');
        this.logger.debug(
          `PaymentService received ${data.length} payment proof images from the server`,
        );
        const images: Image[] = data.map((json: any) => new Image(json.image));
        return images;
      } catch (err: any) {
        this.logger.error(
          'PaymentService: Error fetching PaymentProofs',
          err,
          this.auth.credentials,
        );
        throw err;
      }
    },
  });
}
