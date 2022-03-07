import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-trip-switcher',
  templateUrl: './trip-switcher.component.html',
  styleUrls: ['./trip-switcher.component.scss'],
})
export class TripSwitcherComponent implements OnInit {
  constructor(private logger: NGXLogger) {}

  ngOnInit(): void {
    this.logger.debug('TripSwitcherComponent OnInit');
  }
}
