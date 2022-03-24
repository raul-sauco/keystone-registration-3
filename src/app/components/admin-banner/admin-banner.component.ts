import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Trip } from 'src/app/models/trip';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
  selector: 'app-admin-banner',
  templateUrl: './admin-banner.component.html',
  styleUrls: ['./admin-banner.component.scss'],
})
export class AdminBannerComponent implements OnInit {
  lang: string = 'en';
  trip?: Trip;

  constructor(
    private logger: NGXLogger,
    private translate: TranslateService,
    public tripService: TripSwitcherService,
    public auth: AuthService
  ) {
    this.lang = this.translate.currentLang;
  }

  ngOnInit(): void {
    this.logger.debug('AdminBannerComponent OnInit');
  }
}
