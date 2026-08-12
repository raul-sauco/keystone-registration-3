import { Component, inject, resource } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { LocalizationService } from '@app/services/localization/localization.service';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { LoginRequiredMessageComponent } from '@components/login-required-message/login-required-message.component';
import { NoResultsComponent } from '@components/no-results/no-results.component';
import { AuthState } from '@models/auth-state';
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
export class ProgramOverviewComponent {
  private readonly api = inject(ApiService);
  private readonly globals = inject(GlobalsService);
  private readonly localization = inject(LocalizationService);

  protected readonly AuthState = AuthState;
  protected readonly isChinese = this.localization.isChinese;
  protected readonly url = this.globals.getResUrl();
  protected readonly auth = inject(AuthService);

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
