import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Trip } from 'src/app/models/trip';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-admin-banner',
  templateUrl: './admin-banner.component.html',
  styleUrls: ['./admin-banner.component.scss'],
  imports: [TranslatePipe],
})
export class AdminBannerComponent implements OnInit {
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);
  auth = inject(AuthService);

  lang: string = 'en';
  trip?: Trip;

  constructor() {
    this.lang = this.translate.getCurrentLang();
  }

  ngOnInit(): void {
    this.logger.debug('AdminBannerComponent OnInit');
  }
}
