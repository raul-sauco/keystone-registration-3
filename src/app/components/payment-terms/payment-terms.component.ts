import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

import { ApiService } from '@services/api/api.service';

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
    public translate: TranslateService
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
}
