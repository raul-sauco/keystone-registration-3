import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackComponent implements OnInit {
  feedback$!: Observable<any>;
  canDetermineTrip = true;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private auth: AuthService,
    private tripSwitcher: TripSwitcherService
  ) {}

  ngOnInit(): void {
    this.logger.debug('FeedbackComponent OnInit');
    if (
      this.auth.authenticated &&
      this.auth.getCredentials()?.accessToken &&
      (this.auth.isSchoolAdmin || this.auth.isTeacher)
    ) {
      if (this.auth.isSchoolAdmin) {
        if (this.tripSwitcher.selectedTrip) {
          this.fetch(this.tripSwitcher.selectedTrip.id);
        } else {
          this.canDetermineTrip = false;
          this.logger.debug('FeedbackComponent cannot determine trip');
          this.setEmptyContent();
        }
      } else {
        this.fetch();
      }
    } else {
      this.logger.error(
        'Called FeedbackComponent OnInit without valid ' +
          'authentication status. AuthGuard failure?',
        this.auth.getCredentials()
      );
      this.setEmptyContent();
    }
  }

  /**
   * Set the component content to an empty result set to display correctly.
   */
  protected setEmptyContent(): void {
    this.feedback$ = of({
      count: 0,
      charts: [],
      questions: [],
    });
  }

  /**
   * Subscribe to the ApiService to get feedback data
   */
  fetch(tripId?: number): void {
    this.logger.debug('FeedbackComponent fetch() called');
    const endpoint = tripId ? `feedbacks?trip-id=${tripId}` : 'feedbacks';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.feedback$ = this.api.get(endpoint, null, options);
  }
}
