import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
  selector: 'app-trip-switcher',
  templateUrl: './trip-switcher.component.html',
  styleUrls: ['./trip-switcher.component.scss'],
})
export class TripSwitcherComponent implements OnInit {
  lang: string = 'en';

  constructor(
    private logger: NGXLogger,
    private translate: TranslateService,
    public tripSwitcher: TripSwitcherService
  ) {}

  ngOnInit(): void {
    this.logger.debug('TripSwitcherComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
  }
}
