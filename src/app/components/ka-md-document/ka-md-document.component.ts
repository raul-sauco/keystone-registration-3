import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

import { LocalizationService } from '@app/services/localization/localization.service';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { ApiService } from '@services/api/api.service';

interface MdDocumentJson {
  text: string;
  text_zh: string;
}

@Component({
  selector: 'app-ka-md-document',
  templateUrl: './ka-md-document.component.html',
  styleUrl: './ka-md-document.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LoadingSpinnerContentComponent, MarkdownComponent],
})
export class KaMdDocumentComponent {
  private api = inject(ApiService);
  private localization = inject(LocalizationService);

  // 1. Inputs
  endpoint = input.required<string>();

  protected readonly isChinese = this.localization.isChinese;

  // 3. Automatically fetch the document whenever the endpoint changes
  readonly docResource = resource({
    params: () => this.endpoint(),
    loader: ({ params: url }) => this.api.getAsync<MdDocumentJson>(url),
  });

  // 4. Derive the localized markdown content reactively
  readonly content = computed(() => {
    const doc = this.docResource.value(); // Extract value from the resource
    if (!doc) return null;
    return this.isChinese() ? doc.text_zh : doc.text;
  });
}
