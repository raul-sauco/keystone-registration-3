import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MarkdownModule } from 'ngx-markdown';
import { Observable, map } from 'rxjs';

import { LoadingSpinnerContentModule } from '@components/loading-spinner-content/loading-spinner-content.module';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'app-ka-md-document',
  standalone: true,
  templateUrl: './ka-md-document.component.html',
  styleUrl: './ka-md-document.component.scss',
  imports: [CommonModule, LoadingSpinnerContentModule, MarkdownModule],
  // This is needed to style shadow DOM markdown content.
  encapsulation: ViewEncapsulation.None,
})
export class KaMdDocumentComponent implements OnInit {
  @Input() endpoint!: string;
  content$!: Observable<string>;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.logger.debug('KAMdDocumentComponent::OnInit');
    this.loadContent();
    this.translate.onLangChange.subscribe((_) => this.loadContent());
  }

  loadContent(): void {
    this.content$ = this.api
      .get(this.endpoint)
      .pipe(
        map((doc: any) =>
          this.translate.currentLang.includes('zh') ? doc.text_zh : doc.text,
        ),
      );
  }
}
