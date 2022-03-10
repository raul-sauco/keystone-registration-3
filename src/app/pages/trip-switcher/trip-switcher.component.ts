import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
  selector: 'app-trip-switcher',
  templateUrl: './trip-switcher.component.html',
  styleUrls: ['./trip-switcher.component.scss'],
})
export class TripSwitcherComponent implements OnInit {
  constructor(
    private logger: NGXLogger,
    public tripSwitcher: TripSwitcherService
  ) {}

  ngOnInit(): void {
    this.logger.debug('TripSwitcherComponent OnInit');
  }
}
