import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Faq } from 'src/app/models/faq';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiService } from 'src/app/services/api/api.service';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  faq$: Observable<Faq[]>;
  needsLogin = false;

  constructor(
    private api: ApiService,
    private logger: NGXLogger,
    private routeStateService: RouteStateService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.logger.debug('FaqComponent OnInit');
    const headers: any = { 'Content-Type': 'application/json' };
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        this.routeStateService.tripIdParam$.subscribe((id: string) => {
          if (tripId !== id) {
            this.routeStateService.updateTripIdParamState(tripId);
          }
        });

        // TODO get trip id from auth user
        this.fetch({ 'trip-id': tripId }, headers);
      } else {
        // No trip id parameter, try to find an user
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res && this.auth.getCredentials().accessToken) {
            headers.authorization = `Bearer ${
              this.auth.getCredentials().accessToken
            }`;
            this.fetch(null, headers);
            // this.guide$ = this.guideService.fetchGuides();
          } else {
            this.needsLogin = true;
          }
        });
      }
    });
  }

  /**
   * Have the ApiService request faqs for the current user's
   * trip or based on an optional trip id parameter.
   * @param params optional parameters to send with the request
   * @param headers headers to add to the http options object
   */
  fetch(params: any, headers: any): void {
    const endpoint = 'trip-questions';
    const options = {
      headers: new HttpHeaders(headers),
    };
    this.faq$ = this.api.get(endpoint, params, options).pipe(
      map((faqJson: any) => {
        // Sort the guides and map them to Guide models
        return faqJson
          .sort((a: any, b: any) => a.updated_at - b.updated_at)
          .map((faq: any) => new Faq(faq));
      })
    );
  }

  /** Display a dialog to let users send QAs */
  openDialog(): void {
    if (!this.auth.authenticated || !this.auth.getCredentials().accessToken) {
      this.logger.error('Not logged in user had send QA option', this.auth);
      return;
    }
    const dialogRef = this.dialog.open(PostQaDialogComponent);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.logger.log('User posted new QA');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.auth.getCredentials().accessToken}`,
        };
        this.fetch(null, headers);
      } else {
        this.logger.debug('No QA posted');
      }
    });
  }
}

@Component({
  selector: 'app-post-qa-dialog.component',
  templateUrl: './post-qa-dialog.component.html',
  styleUrls: ['./post-qa-dialog.component.scss'],
})
export class PostQaDialogComponent implements OnInit {
  question: string;

  constructor(
    public dialogRef: MatDialogRef<PostQaDialogComponent>,
    private auth: AuthService,
    private api: ApiService,
    private logger: NGXLogger,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.question = '';
  }

  /** Post the question to the server. */
  send() {
    const q = this.question || this.question.trim();
    if (q === '') {
      this.logger.debug('Empty question body, cancelling');
      this.dialogRef.close(false);
      return;
    }
    this.logger.debug('Posting new QA: ' + q);
    const endpoint = 'trip-questions';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    const params = { question: q };
    this.api.post(endpoint, params, options).subscribe(
      (res: any) => {
        this.logger.debug('Question received correctly');
        this.snackBar.open(this.translate.instant('QUESTION_RECEIVED'), null, {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      (err: any) => {
        this.logger.error('Error posting new QA', {
          question: q,
          auth: this.auth.getCredentials(),
          res: err,
        });
        this.snackBar.open(this.translate.instant('SERVER_ERROR'), null, {
          duration: 3000,
        });
        this.dialogRef.close(false);
      },
      () => {
        // Reset the question in case users want to ask multiple QAs.
        this.question = '';
      }
    );
  }

  /** Close the dialog on cancel button click. */
  cancel(): void {
    this.logger.debug('Dialog cancelled by user');
    this.dialogRef.close(false);
  }
}
