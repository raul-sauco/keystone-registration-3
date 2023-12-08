import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, map } from 'rxjs';

import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';

@Component({
  selector: 'app-payment-instructions',
  templateUrl: './payment-instructions.component.html',
  styleUrls: ['./payment-instructions.component.scss'],
})
export class PaymentInstructionsComponent implements OnInit, OnDestroy {
  lang!: string;
  content$!: Observable<any>;
  timeout: number | null = null;
  helpOpen: boolean = false;

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentInstructionsComponent on init');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    const endpoint =
      `payment-instructions/` + this.auth.getCredentials()?.studentId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.content$ = this.api
      .get(endpoint, null, options)
      .pipe(map((doc: any) => (this.lang === 'zh' ? doc.text_zh : doc.text)));
    // Need to use window.setTimeout to differentiate from NodeJS.Timeout.
    // https://stackoverflow.com/q/51040703/2557030
    this.timeout = window.setTimeout(() => this.displayWarning(), 5000);
  }

  ngOnDestroy(): void {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
  }

  displayWarning(): void {
    this.dialog
      .open(AddParticipantInfoToPaymentReminderDialogComponent)
      .afterClosed()
      .subscribe({
        next: (_) => {
          this.logger.debug('Add payment info warning closed');
        },
      });
  }

  displayPaymentProofHelp(): void {
    if (!this.helpOpen) {
      this.helpOpen = true;
      this.dialog
        .open(AddStudentNameToPaymentProofHelpDialogComponent)
        .afterClosed()
        .subscribe({
          next: () => {
            this.helpOpen = false;
            this.logger.debug('Add student name to payment help closed');
          },
        });
    }
    console.log('TODO: Not implemented yet');
  }
}

@Component({
  selector: 'app-add-participant-info-to-payment-reminder-dialog-component',
  templateUrl:
    './add-participant-info-to-payment-reminder-dialog.component.html',
  styleUrls: [
    './add-participant-info-to-payment-reminder-dialog.component.scss',
  ],
})
export class AddParticipantInfoToPaymentReminderDialogComponent {
  exampleImgUrl: string;
  constructor(
    public dialogRef: MatDialogRef<AddParticipantInfoToPaymentReminderDialogComponent>,
    globals: GlobalsService,
    translate: TranslateService
  ) {
    this.exampleImgUrl =
      globals.getResUrl() +
      'img/portal/example-payment-proof-' +
      (translate.currentLang.includes('zh') ? 'zh' : 'en') +
      '.png';
  }
}

@Component({
  selector: 'app-add-student-name-to-payment-proof-help-dialog-component',
  templateUrl: './add-student-name-to-payment-proof-help-dialog.component.html',
  styleUrls: ['./add-student-name-to-payment-proof-help-dialog.component.scss'],
})
export class AddStudentNameToPaymentProofHelpDialogComponent {
  exampleImgUrl: string;
  constructor(
    public dialogRef: MatDialogRef<AddStudentNameToPaymentProofHelpDialogComponent>,
    globals: GlobalsService,
    translate: TranslateService
  ) {
    this.exampleImgUrl =
      globals.getResUrl() +
      'img/portal/example-payment-proof-' +
      (translate.currentLang.includes('zh') ? 'zh' : 'en') +
      '.png';
  }
}
