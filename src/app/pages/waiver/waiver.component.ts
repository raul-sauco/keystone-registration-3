import { DatePipe } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { Student, StudentData } from '@models/student';
import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { StudentService } from '@services/student/student.service';
import { WaiverContentComponent } from './waiver-content/waiver-content.component';

@Component({
  selector: 'app-waiver',
  templateUrl: './waiver.component.html',
  styleUrls: ['./waiver.component.scss'],
  imports: [
    DatePipe,
    FormsModule,
    LoadingSpinnerContentComponent,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressBar,
    ReactiveFormsModule,
    TranslatePipe,
    WaiverContentComponent,
  ],
})
export class WaiverComponent {
  private formBuilder = inject(FormBuilder);
  private logger = inject(NGXLogger);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly auth = inject(AuthService);
  readonly paymentService = inject(PaymentService);
  readonly studentService = inject(StudentService);
  readonly translate = inject(TranslateService);

  posting = false;

  readonly waiverForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    guardianName: [''],
  });

  constructor() {
    this.logger.debug('WaiverComponent OnInit');
    effect(() => {
      const student = this.studentService.student();
      if (!student) {
        return;
      }
      this.logger.debug('WaiverComponent student updated', student);
      this.populateForm(student);
    });
  }

  get name() {
    return this.waiverForm.controls.name;
  }
  get guardianName() {
    return this.waiverForm.controls.guardianName;
  }

  private populateForm(student: Student): void {
    this.waiverForm.patchValue({
      name: student.name || '',
      guardianName: student.guardianName || '',
    });

    if (this.auth.isStudentSignal()) {
      this.guardianName.addValidators(Validators.required);
    } else {
      this.guardianName.clearValidators();
    }

    this.guardianName.updateValueAndValidity();
  }

  async acceptWaiver(): Promise<void> {
    const today = new Date().toISOString().substring(0, 10);
    const studentData: StudentData = {
      name: this.name.value,
      guardian_name: this.guardianName.value,
      waiver_accepted: 1,
      waiver_signed_on: today,
      terms_accepted: 1,
      terms_accepted_on: today,
    };
    this.posting = true;
    try {
      await this.studentService.updateStudent(studentData);
      const snackBar = this.snackBar.open(this.translate.instant('WAIVER_ACCEPTED'), undefined, {
        duration: 2000,
      });
      snackBar.afterDismissed().subscribe(() => {
        const destination = this.paymentService.paymentInfo.value()?.required
          ? '/payments'
          : '/home';
        this.router.navigateByUrl(destination);
      });
    } catch (error) {
      this.logger.error('Error sending waiver', error);
    } finally {
      this.posting = false;
    }
  }
}
