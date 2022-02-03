import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-payment-qr-codes',
  templateUrl: './payment-qr-codes.component.html',
  styleUrls: ['./payment-qr-codes.component.scss'],
})
export class PaymentQrCodesComponent implements OnInit {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentQrCodes on init');
  }
}
