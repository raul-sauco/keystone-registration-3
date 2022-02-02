import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from './../../../services/payment/payment.service';

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.scss'],
})
export class PaymentTermsComponent implements OnInit {
  lang!: string;
  content$!: Observable<any>;
  sending = false;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private logger: NGXLogger,
    public paymentService: PaymentService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentTermsComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    const endpoint = 'documents/104';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.content$ = this.api.get(endpoint, null, options);
  }

  acceptTerms(): void {
    this.logger.debug('Payment Terms Accepted by User');
    this.sending = true;
    const endpoint = 'payment-info/' + this.auth.getCredentials()?.studentId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    const data = {
      termsAccepted: true,
    };
    this.api.patch(endpoint, data, options).subscribe({
      next: (res: any) => {
        if (res.termsAccepted === true) {
          this.paymentService.setPaymentInfo(res);
        }
      },
      error: (err: any) => {
        console.error(err);
        this.sending = false;
      },
      complete: () => {
        this.sending = false;
      },
    });
  }
}
