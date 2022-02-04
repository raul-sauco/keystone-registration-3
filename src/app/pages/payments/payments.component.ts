import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
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

  ngOnInit(): void {
    this.logger.debug('PaymentsComponent OnInit');
  }
}
