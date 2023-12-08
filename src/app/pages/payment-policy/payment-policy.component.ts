import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, map } from 'rxjs';

import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'app-payment-policy',
  templateUrl: './payment-policy.component.html',
  styleUrls: ['./payment-policy.component.scss'],
})
export class PaymentPolicyComponent implements OnInit {
  content$?: Observable<string>;

  constructor(
    private api: ApiService,
    private logger: NGXLogger,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentPolicyComponent OnInit');
    this.content$ = this.api
      .get(
        'documents/104',
        null,
        new HttpHeaders({
          'Content-Type': 'application/json',
        })
      )
      .pipe(
        map(
          (doc: any) =>
            this.translate.currentLang.includes('zh') ? doc.text_zh : doc.text
          // If management asks to remove the last line of the document, uncomment to add.
          // .replace(/\r?\n?[^\r\n]*$/,'')
        )
      );
  }
}
