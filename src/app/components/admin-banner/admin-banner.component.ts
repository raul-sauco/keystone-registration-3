import { Component, OnInit } from '@angular/core';
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
    public tripService: TripSwitcherService,
    public auth: AuthService
  ) {}

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
