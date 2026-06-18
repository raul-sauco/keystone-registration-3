import { HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, map } from 'rxjs';

import { AsyncPipe } from '@angular/common';
import { MatFabButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ApiService } from '@services/api/api.service';
import { PaymentService } from '@services/payment/payment.service';
import { MarkdownComponent } from 'ngx-markdown';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCard,
    MatCardTitle,
    MatFabButton,
    MatIcon,
    MatCardContent,
    MarkdownComponent,
    LoadingSpinnerContentComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class HelpComponent implements OnInit {
  private api = inject(ApiService);
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);
  private paymentService = inject(PaymentService);

  content$!: Observable<string>;
  private documentId: string = '133';

  ngOnInit(): void {
    this.logger.debug('HelpComponent OnInit');
    if (this.paymentService.paymentInfo.value()?.required) {
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
    this.content$ = this.api
      .get(endpoint, null, options)
      .pipe(
        map((doc: any) =>
          this.translate.getCurrentLang().includes('zh') ? doc.text_zh : doc.text,
        ),
      );
  }
}
