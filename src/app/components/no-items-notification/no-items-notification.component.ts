import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-no-items-notification',
    templateUrl: './no-items-notification.component.html',
    styleUrls: ['./no-items-notification.component.scss'],
    imports: [MatIcon, TranslatePipe]
})
export class NoItemsNotificationComponent {

  @Input() message = 'NO_RESULTS_FOUND';

  constructor() { }

}
