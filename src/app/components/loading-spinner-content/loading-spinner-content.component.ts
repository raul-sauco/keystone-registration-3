import { Component, Input } from '@angular/core';
import { ProgressSpinnerMode, MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loading-spinner-content',
  templateUrl: './loading-spinner-content.component.html',
  styleUrls: ['./loading-spinner-content.component.scss'],
  imports: [MatProgressSpinner, TranslatePipe],
})
export class LoadingSpinnerContentComponent {
  @Input() message = 'LOADING';
  @Input() diameter = 50;
  @Input() strokeWidth = 2;
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor() {}
}
