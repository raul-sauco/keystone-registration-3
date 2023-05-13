import { Component, HostListener, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

import { ComponentCanDeactivate } from '@interfaces/component-can-deactivate';
import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';
import { PaymentService } from '@services/payment/payment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit, ComponentCanDeactivate {
  lang!: string;
  content$!: Observable<any>;
  staticUrl: string;

  constructor(
    private logger: NGXLogger,
    public paymentService: PaymentService,
    public auth: AuthService,
    globals: GlobalsService
  ) {
    this.staticUrl = globals.getResUrl();
  }

  /**
   * Implement canDeactivate condition.
   * @returns False if there are pending actions.
   */
  @HostListener('window:beforeunload')
  canDeactivate(): boolean | Observable<boolean> {
    this.logger.debug('PaymentComponent canDeactivate');
    return this.paymentService.getPaymentInfo()?.paid === true;
  }

  ngOnInit(): void {
    this.logger.debug('PaymentsComponent OnInit');
  }
}
