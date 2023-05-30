import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Subject } from 'rxjs';

import { Image } from '@models/image';
import { PaymentInfo } from '@models/paymentInfo';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { StorageService } from '@services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private paymentInfo?: PaymentInfo;
  paymentInfo$: BehaviorSubject<PaymentInfo> = new BehaviorSubject(
    new PaymentInfo({})
  );
  paymentProof$: Subject<Image[]> = new Subject();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private storage: StorageService,
    private logger: NGXLogger
  ) {
    this.logger.debug('PaymentService constructor');
    // Check credentials and do not load for School Administrators
    this.auth.checkAuthenticated().then((res) => {
      if (res && !this.auth.isSchoolAdmin) {
        this.loadFromStorage();
      }
    });
  }

  /**
   * Refresh the stored payment info value.
   * It will first load from local storage and then, if the user is authenticated,
   * initiate a request to refresh the data from the server.
   */
  loadFromStorage(): void {
    this.storage.get(this.storage.keys.paymentInfo).then((json) => {
      if (json) {
        this.logger.debug('PaymentService found info in storage', json);
        const paymentInfo = new PaymentInfo(json);
        this.paymentInfo = paymentInfo;
        this.paymentInfo$.next(paymentInfo);
      }
      this.fetchFromServer();
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
    this.paymentInfo$.next(paymentInfo);
    return this.storage.set(this.storage.keys.paymentInfo, paymentInfo);
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
          this.logger.warn(
            'PaymentService Unexpected response from the server',
            res
          );
        }
      },
      error: (err: any) => {
        this.logger.warn('PaymentService Fetch payment information error', err);
      },
    });
  }

  /**
   * Fetch payment proofs for the current user from the server.
   */
  fetchPaymentProofs() {
    this.logger.debug('PaymentService fetching payment proof images');
    const endpoint = 'trip-direct-payment-proof?expand=image';
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
        const images: Image[] = res.map((e: any) => new Image(e.image));
        this.paymentProof$.next(images);
      },
      error: (err: any) => {
        this.logger.warn('PaymentService error', err);
        this.paymentProof$.error(err);
      },
    });
  }
}
