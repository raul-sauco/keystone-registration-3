import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { LoginRequiredMessageComponent } from '@components/login-required-message/login-required-message.component';
import { NoItemsNotificationComponent } from '@components/no-items-notification/no-items-notification.component';
import { Document } from '@models/document';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatIcon,
    NoItemsNotificationComponent,
    LoadingSpinnerContentComponent,
    LoginRequiredMessageComponent,
    TranslatePipe,
  ],
})
export class DocumentsComponent implements OnInit {
  private logger = inject(NGXLogger);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private globals = inject(GlobalsService);

  isGuest = false;
  url!: string;

  readonly documents = signal<Document[]>([]);
  readonly hasDocuments = computed(() => this.documents().length > 0);
  readonly loading = signal(false);
  readonly error = signal<unknown | null>(null);

  async ngOnInit(): Promise<void> {
    this.logger.debug('DocumentComponent OnInit');
    this.url = this.globals.getResUrl();
    this.fetch();
    if (!this.auth.authenticated()) {
      this.isGuest = true;
      this.logger.warn('Guest user accessing files');
    }
    await this.fetch();
  }

  async fetch(): Promise<void> {
    this.logger.debug('DocumentComponent fetch() called');
    this.loading.set(true);
    this.error.set(null);
    try {
      const docs = await this.api.getAsync<any[]>('files');
      this.documents.set(docs.map((docJson) => new Document(docJson)));
    } catch (err) {
      this.error.set(err);
      this.logger.error('DocumentComponent fetch error', err);
    } finally {
      this.loading.set(false);
    }
  }
}
