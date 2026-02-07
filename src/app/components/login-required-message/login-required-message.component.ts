import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login-required-message',
  templateUrl: './login-required-message.component.html',
  styleUrls: ['./login-required-message.component.scss'],
  imports: [MatButton, RouterLink, TranslatePipe],
})
export class LoginRequiredMessageComponent {
  @Input() title = 'LOGIN_TO_ACCESS';
  @Input() message = 'LOGIN_OR_SELECT_TRIP_TO_SEE_CONTENT';

  constructor() {}
}
