import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';

import { PaymentInfo } from '@models/paymentInfo';
import { Student } from '@models/student';
import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { StudentService } from '@services/student/student.service';

@Component({
  selector: 'app-waiver',
  templateUrl: './waiver.component.html',
  styleUrls: ['./waiver.component.scss'],
})
export class WaiverComponent implements OnInit, OnDestroy {
  needsLogin = false;
  posting = false;
  waiverForm!: UntypedFormGroup;
  private student$?: Subscription | null = null;
  private paymentInfo?: PaymentInfo | null = null;

  constructor(
    public auth: AuthService,
    private formBuilder: UntypedFormBuilder,
    private logger: NGXLogger,
    private paymentService: PaymentService,
    private router: Router,
    private snackBar: MatSnackBar,
    public studentService: StudentService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('WaiverComponent OnInit');
    this.auth.checkAuthenticated().then((res: boolean) => {
      this.logger.debug('WaiverComponent Resolved Authenticated');
      if (res) {
        if (this.auth.getCredentials()?.accessToken) {
          if (this.auth.getCredentials()?.studentId) {
            this.student$ = this.studentService.student$.subscribe({
              next: (student) => {
                this.logger.debug('WaiverComponent next student$', student);
                this.initWaiverForm(student);
              },
              error: (error) => {
                this.logger.error(
                  'WaiverComponent studentService.student$ error',
                  error
                );
              },
            });
            this.studentService.refreshStudent();
          } else {
            this.logger.error(
              'Authentication error, expected valid student ID.'
            );
          }
        } else {
          this.needsLogin = true;
          this.logger.error('Authentication error, expected access token.');
        }
      } else {
        this.needsLogin = true;
        this.logger.error('Authentication error, expected having auth info.');
      }
    });
    this.listenToPaymentInfoUpdates();
  }

  ngOnDestroy(): void {
    this.logger.debug('WaiverComponent on destroy');
    this.student$?.unsubscribe();
    // Unsubscribing here is causing the subscription to close, odd behavior.
    // this.paymentService.paymentInfo$?.unsubscribe();
  }

  listenToPaymentInfoUpdates(): void {
    this.paymentService.paymentInfo$.subscribe({
      next: (paymentInfo: PaymentInfo) => {
        this.paymentInfo = paymentInfo;
      },
    });
  }

  get name() {
    return this.waiverForm.get('name');
  }
  get guardianName() {
    return this.waiverForm.get('guardianName');
  }

  initWaiverForm(stu: Student): void {
    this.waiverForm = this.formBuilder.group({
      name: [stu.name || '', Validators.required],
      guardianName: [
        stu.guardianName || '',
        this.auth.isStudent ? Validators.required : null,
      ],
    });
  }

  /** Mark the student as having accepted the terms&conditions today. */
  acceptWaiver(): void {
    const today = moment().format('YYYY-MM-DD');
    const studentData = {
      name: this.waiverForm.value.name,
      guardian_name: this.waiverForm.value.guardianName,
      waiver_accepted: 1,
      waiver_signed_on: today,
      terms_accepted: 1,
      terms_accepted_on: today,
    };
    this.posting = true;
    this.studentService.updateStudent(studentData).subscribe({
      next: () => {
        this.posting = false;
        const snackBar = this.snackBar.open(
          this.translate.instant('WAIVER_ACCEPTED'),
          undefined,
          { duration: 2000 }
        );
        snackBar.afterDismissed().subscribe(() => {
          const destination = this.paymentInfo?.required
            ? '/payments'
            : '/home';
          this.router.navigateByUrl(destination);
        });
      },
      error: (error: any) => {
        this.posting = false;
        this.logger.error(`Error sending waiver`, error);
      },
    });
  }
}
