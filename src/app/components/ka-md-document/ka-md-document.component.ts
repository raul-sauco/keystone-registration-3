import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { MarkdownComponent } from 'ngx-markdown';
import { map } from 'rxjs';

import { LoadingSpinnerContentModule } from '@components/loading-spinner-content/loading-spinner-content.module';
import { ApiService } from '@services/api/api.service';

interface MdDocumentJson {
  text: string;
  text_zh: string;
}

@Component({
  selector: 'app-ka-md-document',
  templateUrl: './ka-md-document.component.html',
  styleUrl: './ka-md-document.component.scss',
  imports: [CommonModule, LoadingSpinnerContentModule, MarkdownComponent],
})
export class KaMdDocumentComponent {
  private api = inject(ApiService);
  private translate = inject(TranslateService);

  // 1. Inputs
  endpoint = input.required<string>();

  // 2. Reactively track the current language from the translation service
  readonly lang = toSignal(this.translate.onLangChange.pipe(map((e) => e.lang)), {
    initialValue: this.translate.getCurrentLang(),
  });

  // 3. Automatically fetch the document whenever the endpoint changes
  readonly docResource = resource({
    params: () => this.endpoint(),
    loader: ({ params: url }) => this.api.getAsync<MdDocumentJson>(url),
  });

  // 4. Derive the localized markdown content reactively
  readonly content = computed(() => {
    const doc = this.docResource.value(); // Extract value from the resource
    if (!doc) return null;
    return this.lang().includes('zh') ? doc.text_zh : doc.text;
  });
}
