import { NGXLogger } from 'ngx-logger';
import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-no-results',
    templateUrl: './no-results.component.html',
    styleUrls: ['./no-results.component.scss'],
    imports: [MatIcon, TranslatePipe]
})
export class NoResultsComponent implements OnInit {
  private logger = inject(NGXLogger);


  ngOnInit(): void {
    this.logger.debug('NoResultsComponent OnInit');
  }
}
