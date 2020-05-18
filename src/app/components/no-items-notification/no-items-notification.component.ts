import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-items-notification',
  templateUrl: './no-items-notification.component.html',
  styleUrls: ['./no-items-notification.component.scss']
})
export class NoItemsNotificationComponent {

  @Input() message = 'NO_RESULTS_FOUND';

  constructor() { }

}
