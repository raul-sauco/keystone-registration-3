import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { Student } from 'src/app/models/student';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { StudentService } from 'src/app/services/student/student.service';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-payment-uploaded',
  templateUrl: './payment-uploaded.component.html',
  styleUrls: ['./payment-uploaded.component.scss'],
  imports: [MatButton, MatIcon, MatProgressSpinner, AsyncPipe, TranslatePipe]
})
export class PaymentUploadedComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);
  private router = inject(Router);
  private studentService = inject(StudentService);
  dialog = inject(MatDialog);
  paymentService = inject(PaymentService);

  staticUrl: string;
  private student$: Subscription | null = null;

  constructor() {
    const globals = inject(GlobalsService);

    this.staticUrl =
      globals.getResUrl() +
      'img/trip/pop/' +
      this.auth.getCredentials()?.studentId +
      '/';
  }

  ngOnDestroy(): void {
    this.student$?.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('PaymentUploadedComponent on init');
    this.paymentService.fetchPaymentProofs();
  }

  navigateAway() {
    this.logger.debug('User navigating away from payment-uploaded component');
    this.dialog
      .open(PaymentCompletedConfirmationDialogComponent)
      .afterClosed()
      .subscribe({
        next: () => {
          this.student$ = this.studentService.student$.subscribe({
            next: (student: Student | null) => {
              if (student !== null) {
                if (!student.hasProvidedInformation()) {
                  this.router.navigateByUrl('/personal-info');
                } else if (!student.waiverAccepted) {
                  this.router.navigateByUrl('/waiver');
                } else {
                  this.router.navigateByUrl('/home');
                }
              }
            },
          });
        },
      });
  }
}

@Component({
  selector: 'app-payment-completed-confirmation-dialog-component',
  templateUrl: './payment-completed-confirmation-dialog.component.html',
  styleUrls: ['./payment-completed-confirmation-dialog.component.scss'],
  imports: [MatDialogTitle, MatDialogActions, MatButton, MatDialogClose, TranslatePipe]
})
export class PaymentCompletedConfirmationDialogComponent {
  dialogRef = inject<MatDialogRef<PaymentCompletedConfirmationDialogComponent>>(MatDialogRef);
}
