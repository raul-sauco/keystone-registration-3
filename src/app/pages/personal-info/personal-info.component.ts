import { HttpHeaders } from '@angular/common/http';
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
import { Observable, Subscription, map } from 'rxjs';

import { PaymentInfo } from '@models/paymentInfo';
import { Student } from '@models/student';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { SchoolService } from '@services/school/school.service';
import { StudentService } from '@services/student/student.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  private student$?: Subscription | null = null;
  private paymentInfo?: PaymentInfo | null = null;
  private paymentInfo$?: Subscription | null = null;
  personalInfoForm!: UntypedFormGroup;
  needsLogin = false;
  lang: string = 'en';
  namePromptContent$!: Observable<any>;
  englishNamePromptContent$!: Observable<any>;
  requiredFieldsPromptContent$!: Observable<any>;

  constructor(
    private api: ApiService,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private logger: NGXLogger,
    private router: Router,
    private translate: TranslateService,
    private paymentService: PaymentService,
    public schoolService: SchoolService,
    public studentService: StudentService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.logger.debug('PersonalInfoComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
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
                  student,
                );
                this.initPersonalInfoForm(student);
              },
              error: (error: any) => {
                this.logger.error(
                  'PersonalInfoComponent StudentService student$ error',
                  error,
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
    this.fetchContents();
  }

  fetchContents() {
    this.namePromptContent$ = this.fetchDocumentById(
      this.auth.isStudent ? 145 : 146,
    );
    this.englishNamePromptContent$ = this.fetchDocumentById(
      this.auth.isStudent ? 147 : 142,
    );
    this.requiredFieldsPromptContent$ = this.fetchDocumentById(144);
  }

  fetchDocumentById(id: number): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.api
      .get(`documents/${id}`, null, options)
      .pipe(
        map((content: any) =>
          this.lang === 'zh' ? content.text_zh : content.text,
        ),
      );
  }

  ngOnDestroy(): void {
    this.logger.debug('PersonalInfoComponent on destroy');
    this.student$?.unsubscribe();
    this.paymentInfo$?.unsubscribe();
  }

  get name() {
    return this.personalInfoForm.get('name');
  }

  get englishName() {
    return this.personalInfoForm.get('englishName');
  }

  get citizenship() {
    return this.personalInfoForm.get('citizenship');
  }

  get travelDocument() {
    return this.personalInfoForm.get('travelDocument');
  }

  get email() {
    return this.personalInfoForm.get('email');
  }

  get gender() {
    return this.personalInfoForm.get('gender');
  }

  get dob() {
    return this.personalInfoForm.get('dob');
  }

  initPersonalInfoForm(student: Student): void {
    this.personalInfoForm = this.formBuilder.group({
      name: [student.name, Validators.required],
      englishName: [student.englishName],
      citizenship: [student.citizenship],
      travelDocument: [student.travelDocument, Validators.required],
      email: [student.email, Validators.email],
      gender: [student.gender],
      dob: [student.dob, Validators.required],
      guardianName: [student.guardianName],
      emergencyContact: [student.emergencyContact],
      house: [student.house],
      roomNumber: [student.roomNumber],
      wechatId: [student.wechatId],
      dietaryRequirements: [student.dietaryRequirements],
      dietaryRequirementsOther: [student.dietaryRequirementsOther],
      allergies: [student.allergies],
      allergiesOther: [student.allergiesOther],
      medicalInformation: [student.medicalInformation],
    });
  }

  /** Handle form submission */
  submitPersonalInfoForm(): void {
    const studentData = this.sanitizeData(this.personalInfoForm.value);
    this.studentService.updateStudent(studentData).subscribe({
      next: (student: Student) => {
        this.logger.debug(
          'PersonalInfoComponent updated student data',
          student,
        );
        this.snackBar
          .open(this.translate.instant('PERSONAL_INFO_UPDATED'), undefined, {
            duration: 3000,
          })
          .afterDismissed()
          .subscribe({
            next: () => {
              if (student.waiverAccepted) {
                this.router.navigateByUrl('/home');
              } else {
                this.router.navigateByUrl('/waiver');
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
      name: data.englishName,
      english_name: data.englishName,
      citizenship: data.citizenship,
      travel_document: data.travelDocument,
      email: data.email,
      gender: data.gender,
      guardian_name: data.guardianName,
      emergency_contact: data.emergencyContact,
      house: data.house,
      room_number: data.roomNumber,
      wechat_id: data.wechatId,
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
          'Trying to use invalid date ' + dob.format('YYYY-MM-DD'),
        );
      }
    }
    // Dob could be a moment object.
    return sanitizedData;
  }
}
