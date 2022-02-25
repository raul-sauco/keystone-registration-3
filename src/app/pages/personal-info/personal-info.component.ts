import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { PaymentInfo } from 'src/app/models/paymentInfo';
import { Student } from 'src/app/models/student';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  private student$?: Subscription | null = null;
  private paymentInfo?: PaymentInfo | null = null;
  private paymentInfo$?: Subscription | null = null;
  personalInfoForm!: FormGroup;
  needsLogin = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private logger: NGXLogger,
    private router: Router,
    private translate: TranslateService,
    private paymentService: PaymentService,
    public studentService: StudentService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PersonalInfoComponent OnInit');
    this.auth.checkAuthenticated().then((res: boolean) => {
      const credentials = this.auth.getCredentials();
      if (res && credentials) {
        if (credentials.accessToken) {
          if (credentials.studentId) {
            this.studentService.refreshStudent();
            this.student$ = this.studentService.student$.subscribe({
              next: (student: Student) => {
                this.logger.debug(
                  'PersonalInfoComponent StudentService.student$.next',
                  student
                );
                this.initPersonalInfoForm(student);
              },
              error: (error: any) => {
                this.logger.error(
                  'PersonalInfoComponent StudentService student$ error',
                  error
                );
              },
            });
            this.paymentInfo$ = this.paymentService.paymentInfo$.subscribe({
              next: (paymentInfo: PaymentInfo) => {
                this.paymentInfo = paymentInfo;
              },
            });
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
    this.logger.debug('PersonalInfoComponent on destroy');
    this.student$?.unsubscribe();
    this.paymentInfo$?.unsubscribe();
  }

  get dob() {
    return this.personalInfoForm.get('dob');
  }

  initPersonalInfoForm(student: Student): void {
    this.personalInfoForm = this.formBuilder.group({
      firstName: [student.firstName],
      lastName: [student.lastName],
      citizenship: [student.citizenship],
      travelDocument: [student.travelDocument],
      gender: [student.gender],
      dob: [student.dob],
      guardianName: [student.guardianName],
      emergencyContact: [student.emergencyContact],
      dietaryRequirements: [student.dietaryRequirements],
      dietaryRequirementsOther: [student.dietaryRequirementsOther],
      allergies: [student.allergies],
      allergiesOther: [student.allergiesOther],
      medicalInformation: [student.medicalInformation],
      // insurance: [this.student.insurance],
      // insuranceName: [this.student.insuranceName],
      // insurancePolicyNumber: [this.student.insurancePolicyNumber],
    });
  }

  /** Handle form submission */
  submitPersonalInfoForm(): void {
    const studentData = this.sanitizeData(this.personalInfoForm.value);
    this.studentService.updateStudent(studentData).subscribe({
      next: (student) => {
        this.logger.debug(
          'PersonalInfoComponent updated student data',
          student
        );
        this.snackBar
          .open(this.translate.instant('PERSONAL_INFO_UPDATED'), undefined, {
            duration: 3000,
          })
          .afterDismissed()
          .subscribe({
            next: () => {
              if (
                this.auth.getCredentials()?.type === 6 &&
                this.paymentInfo?.required &&
                !this.paymentInfo.paid
              ) {
                this.router.navigateByUrl('/payments');
              } else {
                this.router.navigateByUrl('/home');
              }
            },
          });
      },
    });
  }

  /** Compare number select values to determine if we have a value already. */
  intValueCompare(v: any, c: any): boolean {
    return +v === +c;
  }

  /** Sanitize the data entered by the user before sending it to the server. */
  sanitizeData(data: any): any {
    const sanitizedData: any = {
      first_name: data.firstName,
      last_name: data.lastName,
      citizenship: data.citizenship,
      travel_document: data.travelDocument,
      gender: data.gender,
      guardian_name: data.guardianName,
      emergency_contact: data.emergencyContact,
      waiver_accepted: data.waiverAccepted,
      waiver_signed_on: data.waiverSignedOn,
      dietary_requirements: data.dietaryRequirements,
      dietary_requirements_other: data.dietaryRequirementsOther,
      allergies: data.allergies,
      allergies_other: data.allergiesOther,
      medical_information: data.medicalInformation,
      // insurance: data.insurance,
      // insurance_name: data.insuranceName,
      // insurance_policy_number: data.insurancePolicyNumber,
    };
    if (data.dob) {
      let dob = data.dob;
      if (!moment.isMoment(dob)) {
        dob = moment(dob);
      }
      if (dob.isValid()) {
        sanitizedData.dob = dob.format('YYYY-MM-DD');
      } else {
        this.logger.warn(
          'Trying to use invalid date ' + dob.format('YYYY-MM-DD')
        );
      }
    }
    // Dob could be a moment object.
    return sanitizedData;
  }
}
