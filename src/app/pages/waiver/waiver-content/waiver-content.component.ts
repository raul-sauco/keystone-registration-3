import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-waiver-content',
  templateUrl: './waiver-content.component.html',
  styleUrls: ['./waiver-content.component.scss'],
})
export class WaiverContentComponent implements OnInit {
  constructor(public translate: TranslateService, private logger: NGXLogger) {}

  ngOnInit(): void {
    this.logger.debug('WaiverContentComponent OnInit');
  }
}
