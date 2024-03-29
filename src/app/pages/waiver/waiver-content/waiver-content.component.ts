import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, map } from 'rxjs';

import { PaymentInfo } from '@models/paymentInfo';
import { ApiService } from '@services/api/api.service';
import { PaymentService } from '@services/payment/payment.service';
@Component({
  selector: 'app-waiver-content',
  templateUrl: './waiver-content.component.html',
  styleUrls: ['./waiver-content.component.scss'],
})
export class WaiverContentComponent implements OnInit {
  content$!: Observable<any>;

  constructor(
    private logger: NGXLogger,
    private paymentService: PaymentService,
    public api: ApiService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('WaiverContentComponent::OnInit');
    this.fetchContents();
  }

  fetchContents() {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.paymentService.paymentInfo$.subscribe({
      next: (paymentInfo: PaymentInfo) => {
        const endpoint = 'documents/' + (paymentInfo?.required ? '104' : '75');
        this.content$ = this.api
          .get(endpoint, null, options)
          .pipe(
            map((doc: any) =>
              this.translate.currentLang.includes('zh') ? doc.text_zh : doc.text
            )
          );
      },
    });
  }
}
