import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MarkdownComponent } from 'ngx-markdown';

import { ApiService } from '@services/api/api.service';
import { PaymentService } from '@services/payment/payment.service';
@Component({
  selector: 'app-waiver-content',
  templateUrl: './waiver-content.component.html',
  styleUrls: ['./waiver-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.translate.onLangChange.subscribe(() => this.pushContent());
  }

  fetchDocument() {
    const documentId = this.paymentService.paymentInfo.value()?.required ? '104' : '75';
    this.api.get(`documents/${documentId}`).subscribe((doc) => {
      this.document = doc;
      this.pushContent();
    });
  }

  pushContent() {
    this.content.set(
      this.translate.getCurrentLang()?.includes('zh') ? this.document.text_zh : this.document.text,
    );
  }
}
