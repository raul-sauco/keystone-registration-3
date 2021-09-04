import { NGXLogger } from 'ngx-logger';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  constructor(private logger: NGXLogger) {}

  ngOnInit(): void {
    this.logger.debug('HelpComponent OnInit');
  }
}
