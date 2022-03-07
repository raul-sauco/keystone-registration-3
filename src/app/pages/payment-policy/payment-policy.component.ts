import { HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-payment-policy',
  templateUrl: './payment-policy.component.html',
  styleUrls: ['./payment-policy.component.scss'],
})
export class PaymentPolicyComponent implements OnInit {
  content$?: Observable<any>;
  lang!: string;

  constructor(
    private api: ApiService,
    private logger: NGXLogger,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentPolicyComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    this.content$ = this.api.get(
      'documents/104',
      null,
      new HttpHeaders({
        'Content-Type': 'application/json',
      })
    );
    // If management asks to remove the last line of the document uncomment the following.
    // .pipe(
    //   map((response: any) => {
    //     const pattern = /\r?\n?[^\r\n]*$/;
    //     response.text = response.text.replace(pattern, '');
    //     response.text_zh = response.text_zh.replace(pattern, '');
    //     return response;
    //   })
    // );
  }
}
