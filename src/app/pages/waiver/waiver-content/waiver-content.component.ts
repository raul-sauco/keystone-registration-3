import { Component, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { PaymentInfo } from '@models/paymentInfo';
import { ApiService } from '@services/api/api.service';
import { PaymentService } from '@services/payment/payment.service';
@Component({
  selector: 'app-waiver-content',
  templateUrl: './waiver-content.component.html',
  styleUrls: ['./waiver-content.component.scss'],
})
export class WaiverContentComponent implements OnInit {
  document!: any;
  content = signal(null);

  constructor(
    private logger: NGXLogger,
    private paymentService: PaymentService,
    public api: ApiService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.logger.debug('WaiverContentComponent::OnInit');
    this.fetchDocument();
    this.translate.onLangChange.subscribe((_) => this.pushContent());
  }

  fetchDocument() {
    this.paymentService.paymentInfo$.subscribe({
      next: (paymentInfo: PaymentInfo) => {
        const endpoint = 'documents/' + (paymentInfo?.required ? '104' : '75');
        this.api.get(endpoint).subscribe((doc) => {
          this.document = doc;
          this.pushContent();
        });
      },
    });
  }

  pushContent() {
    this.content.set(
      this.translate.currentLang.includes('zh')
        ? this.document.text_zh
        : this.document.text,
    );
  }
}
