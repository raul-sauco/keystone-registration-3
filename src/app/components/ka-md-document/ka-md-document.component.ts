import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MarkdownModule } from 'ngx-markdown';
import { Observable, map } from 'rxjs';

import { LoadingSpinnerContentModule } from '@components/loading-spinner-content/loading-spinner-content.module';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'app-ka-md-document',
  templateUrl: './ka-md-document.component.html',
  styleUrl: './ka-md-document.component.scss',
  imports: [CommonModule, LoadingSpinnerContentModule, MarkdownModule],
  // This is needed to style shadow DOM markdown content.
  encapsulation: ViewEncapsulation.None,
})
export class KaMdDocumentComponent implements OnInit {
  private logger = inject(NGXLogger);
  private api = inject(ApiService);
  private translate = inject(TranslateService);

  @Input() endpoint!: string;
  content$!: Observable<string>;

  ngOnInit(): void {
    this.logger.debug('KAMdDocumentComponent::OnInit');
    this.loadContent();
    this.translate.onLangChange.subscribe((_) => this.loadContent());
  }

  loadContent(): void {
    this.content$ = this.api
      .get(this.endpoint)
      .pipe(
        map((doc: any) => (this.translate.currentLang.includes('zh') ? doc.text_zh : doc.text)),
      );
  }
}
