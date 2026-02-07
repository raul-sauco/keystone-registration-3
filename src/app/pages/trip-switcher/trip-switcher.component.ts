import { Component, OnInit, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';
import { AsyncPipe } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';

@Component({
  selector: 'app-trip-switcher',
  templateUrl: './trip-switcher.component.html',
  styleUrls: ['./trip-switcher.component.scss'],
  imports: [MatRipple, LoadingSpinnerContentComponent, AsyncPipe, TranslatePipe],
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
