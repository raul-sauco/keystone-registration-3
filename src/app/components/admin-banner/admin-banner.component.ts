import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Trip } from 'src/app/models/trip';

@Component({
  selector: 'app-admin-banner',
  templateUrl: './admin-banner.component.html',
  styleUrls: ['./admin-banner.component.scss'],
})
export class AdminBannerComponent implements OnInit {
  trip?: Trip;

  constructor(private logger: NGXLogger, private translate: TranslateService) {}

  ngOnInit(): void {
    // TODO remove placeholder logic
    this.logger.debug('AdminBannerComponent OnInit');
    this.trip = new Trip({ id: 1, name: 'Placeholder Trip name' });
  }

  /**
   * Let a school admin navigate to the select trip page.
   */
  browseAvailableTrips(): void {
    console.log('TODO: Navigate to select trip page');
  }
}
