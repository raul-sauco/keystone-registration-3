import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  lang!: string;
  content$!: Observable<any>;

  constructor(
    public auth: AuthService,
    private logger: NGXLogger,
    public paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentsComponent OnInit');
  }
}
