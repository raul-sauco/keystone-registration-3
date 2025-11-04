import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';

import { PaymentInfo } from '@models/paymentInfo';
import { Student } from '@models/student';
import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { StudentService } from '@services/student/student.service';
import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { LoginRequiredMessageComponent } from '../../components/login-required-message/login-required-message.component';
import { WaiverContentComponent } from './waiver-content/waiver-content.component';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';

@Component({
    selector: 'app-waiver',
    templateUrl: './waiver.component.html',
    styleUrls: ['./waiver.component.scss'],
    imports: [NgIf, LoginRequiredMessageComponent, WaiverContentComponent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatProgressBar, MatButton, LoadingSpinnerContentComponent, AsyncPipe, DatePipe, TranslatePipe]
})
export class WaiverComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  private formBuilder = inject(UntypedFormBuilder);
  private logger = inject(NGXLogger);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  studentService = inject(StudentService);
  translate = inject(TranslateService);

  needsLogin = false;
  posting = false;
  waiverForm!: UntypedFormGroup;
  private student$?: Subscription | null = null;
  private paymentInfo?: PaymentInfo | null = null;

  ngOnInit(): void {
    this.logger.debug('WaiverComponent OnInit');
    this.auth.checkAuthenticated().then((res: boolean) => {
      this.logger.debug('WaiverComponent Resolved Authenticated');
      if (res) {
        if (this.auth.getAccessToken()) {
          if (this.auth.getCredentials()?.studentId) {
            this.student$ = this.studentService.student$.subscribe({
              next: (student) => {
                this.logger.debug('WaiverComponent next student$', student);
                this.initWaiverForm(student);
              },
              error: (error) => {
                this.logger.error(
                  'WaiverComponent studentService.student$ error',
                  error,
                );
              },
            });
            this.studentService.refreshStudent();
          } else {
            this.logger.error(
              'Authentication error, expected valid student ID.',
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
    const today = new Date().toISOString().substring(0, 10);
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
          { duration: 2000 },
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
