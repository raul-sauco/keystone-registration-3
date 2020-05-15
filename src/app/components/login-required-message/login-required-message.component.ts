import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-required-message',
  templateUrl: './login-required-message.component.html',
  styleUrls: ['./login-required-message.component.scss']
})
export class LoginRequiredMessageComponent {

  @Input() title = 'LOGIN_TO_ACCESS';
  @Input() message = 'LOGIN_OR_SELECT_TRIP_TO_SEE_CONTENT';

  constructor() { }

}
