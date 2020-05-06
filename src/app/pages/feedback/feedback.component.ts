import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  feedback$: Observable<any>;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.logger.debug('FeedbackComponent OnInit');
    if (
      this.auth.authenticated &&
      this.auth.getCredentials().accessToken &&
      this.auth.getCredentials().type === 4
    ) {
      this.fetch();
    } else {
      this.logger.error(
        'Called FeedbackComponent OnInit without valid ' +
          'authentication status. AuthGuard failure?',
        this.auth.getCredentials()
      );

      // Return an empty result set to display the 'No Feedback' message
      this.feedback$ = of({
        count: 0,
        charts: [],
        questions: [],
      });
    }
  }

  /**
   * Subscribe to the ApiService to get feedback data
   */
  fetch(): void {
    this.logger.debug('FeedbackComponent fetch() called');
    const endpoint = 'feedbacks';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    this.feedback$ = this.api.get(endpoint, null, options);
  }
}
