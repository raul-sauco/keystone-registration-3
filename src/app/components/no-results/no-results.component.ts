import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, TranslatePipe],
})
export class NoResultsComponent implements OnInit {
  private logger = inject(NGXLogger);

  ngOnInit(): void {
    this.logger.debug('NoResultsComponent OnInit');
  }
}
