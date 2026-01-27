import { Component, OnInit, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Trip } from 'src/app/models/trip';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-admin-banner',
    templateUrl: './admin-banner.component.html',
    styleUrls: ['./admin-banner.component.scss'],
    imports: [MatButton, RouterLink, AsyncPipe, TranslatePipe]
})
export class AdminBannerComponent implements OnInit {
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);
  tripService = inject(TripSwitcherService);
  auth = inject(AuthService);

  lang: string = 'en';
  trip?: Trip;

  constructor() {
    this.lang = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.logger.debug('AdminBannerComponent OnInit');
  }
}
