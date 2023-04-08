import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { Student } from 'src/app/models/student';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-payment-uploaded',
  templateUrl: './payment-uploaded.component.html',
  styleUrls: ['./payment-uploaded.component.scss'],
})
export class PaymentUploadedComponent implements OnInit, OnDestroy {
  staticUrl: string;
  private student$: Subscription | null = null;

  constructor(
    private auth: AuthService,
    private logger: NGXLogger,
    private router: Router,
    private studentService: StudentService,
    public dialog: MatDialog,
    public paymentService: PaymentService,
    globals: GlobalsService
  ) {
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
            next: (student: Student) => {
              if (!student.hasProvidedInformation()) {
                this.router.navigateByUrl('/personal-info');
              } else {
                this.router.navigateByUrl('/home');
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
})
export class PaymentCompletedConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PaymentCompletedConfirmationDialogComponent>
  ) {}
}
