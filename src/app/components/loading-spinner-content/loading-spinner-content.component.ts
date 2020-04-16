import { Component, Input } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner-content',
  templateUrl: './loading-spinner-content.component.html',
  styleUrls: ['./loading-spinner-content.component.scss'],
})
export class LoadingSpinnerContentComponent {

  @Input() message = 'LOADING';
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor() { }

}
