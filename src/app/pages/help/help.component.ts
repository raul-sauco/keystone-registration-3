import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

import { ApiService } from '@services/api/api.service';
import { PaymentService } from '@services/payment/payment.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HelpComponent implements OnInit {
  content$!: Observable<any>;
  lang!: string;
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
    if (this.paymentService.paymentInfo$.getValue()?.required) {
      this.documentId = '131';
    }
    this.fetchContent();
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
}
