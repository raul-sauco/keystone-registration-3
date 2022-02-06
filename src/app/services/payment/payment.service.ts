import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { Image } from 'src/app/models/image';
import { PaymentInfo } from 'src/app/models/paymentInfo';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private PAYMENT_INFO_STORAGE_KEY =
    'KEYSTONE_ADVENTURES_PAYMENT_INFO_STORAGE_KEY';
  private paymentInfo?: PaymentInfo;
  paymentProof$: Subject<Image[]> = new Subject();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private storage: StorageService,
    private logger: NGXLogger
  ) {
    this.logger.debug('PaymentService constructor');
    this.loadFromStorage();
  }

  /**
   * Load the current value of
   */
  loadFromStorage(): void {
    this.storage.get(this.PAYMENT_INFO_STORAGE_KEY).then((json) => {
      if (json) {
        this.logger.debug('PaymentService found info in storage', json);
        this.paymentInfo = new PaymentInfo(json);
      }
    });
  }

  /**
   * Payment info setter.
   * @param paymentInfo
   * @returns
   */
  setPaymentInfo(paymentInfo: PaymentInfo): Promise<any> {
    this.logger.debug('PaymentService; saving info to storage');
    this.paymentInfo = paymentInfo;
    return this.storage.set(this.PAYMENT_INFO_STORAGE_KEY, paymentInfo);
  }

  /**
   * Payment info getter.
   * @returns The current value of payment info.
   */
  getPaymentInfo(): PaymentInfo | undefined {
    return this.paymentInfo;
  }

  /**
   * Fetch the payment information for the current user from the server.
   */
  fetchFromServer() {
    const endpoint = 'payment-info/' + this.auth.getCredentials()?.studentId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.api.get(endpoint, null, options).subscribe({
      next: (res: any) => {
        if (res) {
          this.logger.debug('PaymentService got info from server', res);
          this.setPaymentInfo(new PaymentInfo(res));
        } else {
          this.logger.warn('Unexpected response from server', res);
        }
      },
      error: (err: any) => {
        this.logger.warn('Unexpected response from server', err);
      },
    });
  }

  /**
   * Fetch payment proofs for the current user from the server.
   */
  fetchPaymentProofs() {
    this.logger.debug('PaymentService fetching payment proof images');
    const endpoint = 'trip-direct-payment-proof';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.api.get(endpoint, null, options).subscribe({
      next: (res: any) => {
        this.logger.debug(
          `PaymentService received ${res.length} payment proof images from the server`
        );
        const images: Image[] = res.map((e: any) => new Image(e));
        this.paymentProof$.next(images);
      },
      error: (err: any) => {
        this.logger.warn('PaymentService error', err);
        this.paymentProof$.error(err);
      },
    });
  }
}
