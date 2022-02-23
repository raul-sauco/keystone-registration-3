import { Component, OnDestroy, OnInit } from '@angular/core';
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
    this.student$ = this.studentService.student$.subscribe({
      next: (student: Student) => {
        if (!student.hasProvidedInformation()) {
          this.router.navigateByUrl('/personal-info');
        } else if (!student.waiverAccepted) {
          this.router.navigateByUrl('/waiver');
        } else {
          this.router.navigateByUrl('/home');
        }
      },
    });
  }
}
