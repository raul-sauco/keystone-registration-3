import { Component, OnInit, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
    selector: 'app-trip-switcher',
    templateUrl: './trip-switcher.component.html',
    styleUrls: ['./trip-switcher.component.scss'],
    standalone: false
})
export class TripSwitcherComponent implements OnInit {
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);
  tripSwitcher = inject(TripSwitcherService);

  lang: string = 'en';

  ngOnInit(): void {
    this.logger.debug('TripSwitcherComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
  }
}
