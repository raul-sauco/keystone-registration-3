import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressSpinner, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loading-spinner-content',
  templateUrl: './loading-spinner-content.component.html',
  styleUrls: ['./loading-spinner-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatProgressSpinner, TranslatePipe],
})
export class LoadingSpinnerContentComponent {
  @Input() message = 'LOADING';
  @Input() diameter = 50;
  @Input() strokeWidth = 2;
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor() {}
}
