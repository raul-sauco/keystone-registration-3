import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-payment-uploaded',
  templateUrl: './payment-uploaded.component.html',
  styleUrls: ['./payment-uploaded.component.scss'],
})
export class PaymentUploadedComponent implements OnInit {
  staticUrl: string;

  constructor(
    private auth: AuthService,
    private logger: NGXLogger,
    public paymentService: PaymentService,
    globals: GlobalsService
  ) {
    this.staticUrl =
      globals.getResUrl() +
      'img/trip/pop/' +
      this.auth.getCredentials()?.studentId +
      '/';
  }

  ngOnInit(): void {
    this.logger.debug('PaymentUploadedComponent on init');
    this.paymentService.fetchPaymentProofs();
  }
}
