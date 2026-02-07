import { Component, OnInit, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { PaymentInfo } from '@models/paymentInfo';
import { ApiService } from '@services/api/api.service';
import { PaymentService } from '@services/payment/payment.service';
import { MarkdownComponent } from 'ngx-markdown';
@Component({
  selector: 'app-waiver-content',
  templateUrl: './waiver-content.component.html',
  styleUrls: ['./waiver-content.component.scss'],
  imports: [MarkdownComponent],
})
export class WaiverContentComponent implements OnInit {
  private logger = inject(NGXLogger);
  private paymentService = inject(PaymentService);
  api = inject(ApiService);
  translate = inject(TranslateService);

  document!: any;
  content = signal(null);

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
      this.translate.currentLang.includes('zh') ? this.document.text_zh : this.document.text,
    );
  }
}
