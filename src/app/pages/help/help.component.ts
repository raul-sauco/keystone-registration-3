import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { PaymentInfo } from 'src/app/models/paymentInfo';
import { ApiService } from 'src/app/services/api/api.service';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HelpComponent implements OnInit, OnDestroy {
  content$!: Observable<any>;
  lang!: string;
  private isPaymentEnabled: boolean = false;
  private documentId: string = '133';

  constructor(
    private api: ApiService,
    private logger: NGXLogger,
    private translate: TranslateService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.logger.debug('HelpComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    this.fetchContent();
    this.paymentService.paymentInfo$.subscribe((paymentInfo: PaymentInfo) => {
      // For trips with payment enabled, show a more comprehensive help page.
      if (paymentInfo.required) {
        this.documentId = '131';
        this.fetchContent();
      }
    });
  }

  fetchContent(): void {
    const endpoint = `documents/${this.documentId}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.content$ = this.api.get(endpoint, null, options);
  }

  ngOnDestroy(): void {
    this.paymentService.paymentInfo$.unsubscribe();
  }
}
