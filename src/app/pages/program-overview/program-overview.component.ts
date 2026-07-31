import { Component, OnInit, inject, resource } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { AuthState } from '@app/models/auth-state';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { LoginRequiredMessageComponent } from '@components/login-required-message/login-required-message.component';
import { NoResultsComponent } from '@components/no-results/no-results.component';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';

interface FileJson {
  id: number;
  name_en: string;
  name_zh: string;
  file_type: string;
  version: string;
  link: string;
  size: number;
}

@Component({
  selector: 'app-program-overview',
  templateUrl: './program-overview.component.html',
  styleUrls: ['./program-overview.component.scss'],
  imports: [
    LoginRequiredMessageComponent,
    MatIcon,
    NoResultsComponent,
    LoadingSpinnerContentComponent,
    TranslatePipe,
  ],
})
export class ProgramOverviewComponent implements OnInit {
  private api = inject(ApiService);
  private globals = inject(GlobalsService);
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);
  auth = inject(AuthService);

  protected readonly AuthState = AuthState;
  url: string;
  lang: string;

  constructor() {
    this.url = this.globals.getResUrl();
    this.lang = this.translate.getCurrentLang();
  }

  ngOnInit(): void {
    this.logger.debug('ProgramOverviewComponent OnInit');
  }

  readonly documentResource = resource({
    params: () => this.auth.credentialsSignal(),
    loader: async ({ params: credentials }) => {
      if (credentials === null) {
        return null;
      }
      return await this.api.getAsync<FileJson[]>('files?tagged=itinerary');
    },
  });
}
