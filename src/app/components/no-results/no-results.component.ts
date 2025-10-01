import { NGXLogger } from 'ngx-logger';
import { Component, OnInit, inject } from '@angular/core';

@Component({
    selector: 'app-no-results',
    templateUrl: './no-results.component.html',
    styleUrls: ['./no-results.component.scss'],
    standalone: false
})
export class NoResultsComponent implements OnInit {
  private logger = inject(NGXLogger);


  ngOnInit(): void {
    this.logger.debug('NoResultsComponent OnInit');
  }
}
