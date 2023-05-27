import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';

import { PaymentInfo } from '@models/paymentInfo';
import { ApiService } from '@services/api/api.service';
import { PaymentService } from '@services/payment/payment.service';

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.scss'],
})
export class PaymentTermsComponent implements OnInit {
  lang!: string;
  content$!: Observable<any>;

  constructor(
    private api: ApiService,
    private logger: NGXLogger,
    public paymentService: PaymentService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentTermsComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    this.paymentService.paymentInfo$.subscribe((paymentInfo: PaymentInfo) => {
      if (paymentInfo.required) {
        const endpoint = 'documents/104';
        const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        };
        this.content$ = this.api.get(endpoint, null, options);
      } else {
        this.content$ = of({ text: '', text_zh: '' });
      }
    });
  }
}
