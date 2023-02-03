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
import { Student } from 'src/app/models/student';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StudentService } from 'src/app/services/student/student.service';

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

  constructor(
    public auth: AuthService,
    private formBuilder: UntypedFormBuilder,
    private logger: NGXLogger,
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
  }

  ngOnDestroy(): void {
    this.logger.debug('WaiverComponent on destroy');
    this.student$?.unsubscribe();
  }

  get firstName() {
    return this.waiverForm.get('firstName');
  }
  get lastName() {
    return this.waiverForm.get('lastName');
  }
  get guardianName() {
    return this.waiverForm.get('guardianName');
  }

  initWaiverForm(stu: Student): void {
    this.waiverForm = this.formBuilder.group({
      firstName: [stu.firstName || '', Validators.required],
      lastName: [stu.lastName || '', Validators.required],
      guardianName: [
        stu.guardianName || '',
        this.auth.getCredentials()?.type === 4 ? null : Validators.required,
      ],
    });
  }

  /** Mark the student as having accepted the waiver today. */
  acceptWaiver(): void {
    const studentData = {
      first_name: this.waiverForm.value.firstName,
      last_name: this.waiverForm.value.lastName,
      guardian_name: this.waiverForm.value.guardianName,
      waiver_accepted: 1,
      waiver_signed_on: moment().format('YYYY-MM-DD'),
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
          this.router.navigateByUrl('/personal-info');
        });
      },
      error: (error: any) => {
        this.posting = false;
        this.logger.error(`Error sending waiver`, error);
      },
    });
  }
}
