import { Component, HostListener, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '@interfaces/component-can-deactivate';
import { PaymentService } from '@services/payment/payment.service';

import { PaymentClosedComponent } from './payment-closed/payment-closed.component';
import { PaymentInstructionsComponent } from './payment-instructions/payment-instructions.component';
import { PaymentQrCodesComponent } from './payment-qr-codes/payment-qr-codes.component';
import { PaymentUploadProofComponent } from './payment-upload-proof/payment-upload-proof.component';
import { PaymentUploadedComponent } from './payment-uploaded/payment-uploaded.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  imports: [
    PaymentInstructionsComponent,
    PaymentQrCodesComponent,
    PaymentUploadProofComponent,
    PaymentUploadedComponent,
    PaymentClosedComponent,
  ],
})
export class PaymentsComponent implements OnInit, ComponentCanDeactivate {
  private logger = inject(NGXLogger);
  paymentService = inject(PaymentService);

  /**
   * Implement canDeactivate condition.
   * @returns False if there are pending actions.
   */
  @HostListener('window:beforeunload')
  canDeactivate(): boolean | Observable<boolean> {
    this.logger.debug('PaymentComponent canDeactivate');
    return this.paymentService.paymentInfo.value()?.paid === true;
  }

  ngOnInit(): void {
    this.logger.debug('PaymentsComponent OnInit');
  }
}
