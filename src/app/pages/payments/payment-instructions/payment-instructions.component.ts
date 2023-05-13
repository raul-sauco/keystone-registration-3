import { HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-payment-instructions',
  templateUrl: './payment-instructions.component.html',
  styleUrls: ['./payment-instructions.component.scss'],
})
export class PaymentInstructionsComponent implements OnInit, OnDestroy {
  lang!: string;
  content$!: Observable<any>;
  timeout: number | null = null;

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
    this.content$ = this.api.get(endpoint, null, options);
    // Need to use window.setTimeout to differentiate from NodeJS.Timeout.
    // https://stackoverflow.com/q/51040703/2557030
    this.timeout = window.setTimeout(() => this.displayWarning(), 10000);
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
  constructor(
    public dialogRef: MatDialogRef<AddParticipantInfoToPaymentReminderDialogComponent>
  ) {}
}
