import { AsyncPipe, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MarkdownComponent } from 'ngx-markdown';
import { Observable, firstValueFrom, map } from 'rxjs';

import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { SchoolService } from '@services/school/school.service';
import { StudentService } from '@services/student/student.service';
import { IdPhotoComponent } from './id-photo/id-photo.component';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    FormsModule,
    IdPhotoComponent,
    LoadingSpinnerContentComponent,
    MarkdownComponent,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class PersonalInfoComponent implements OnInit {
  private api = inject(ApiService);
  private formBuilder = inject(NonNullableFormBuilder);
  private snackBar = inject(MatSnackBar);
  private logger = inject(NGXLogger);
  private router = inject(Router);
  private translate = inject(TranslateService);
  schoolService = inject(SchoolService);
  studentService = inject(StudentService);
  auth = inject(AuthService);

  @ViewChild('photoId') photoIdElement!: ElementRef;
  idPhotoProvided = false;
  idPhotoRequired = false;
  lang: string = 'en';
  namePromptContent$!: Observable<any>;
  englishNamePromptContent$!: Observable<any>;
  requiredFieldsPromptContent$!: Observable<any>;

  readonly personalInfoForm = this.formBuilder.group({
    name: this.formBuilder.control('', {
      validators: [Validators.required],
    }),
    englishName: this.formBuilder.control(''),
    citizenship: this.formBuilder.control(''),
    travelDocument: this.formBuilder.control('', {
      validators: [Validators.required],
    }),
    email: this.formBuilder.control('', {
      validators: [Validators.email],
    }),
    gender: this.formBuilder.control<number | null>(null),
    dob: this.formBuilder.control('', {
      validators: [Validators.required],
    }),
    guardianName: this.formBuilder.control(''),
    emergencyContact: this.formBuilder.control(''),
    house: this.formBuilder.control<string | null>(''),
    roomNumber: this.formBuilder.control<string | null>(''),
    homeroom: this.formBuilder.control<string | null>(''),
    grade: this.formBuilder.control<string | null>(''),
    studentId: this.formBuilder.control<string | null>(''),
    wechatId: this.formBuilder.control(''),
    dietaryRequirements: this.formBuilder.control<number | null>(null),
    dietaryRequirementsOther: this.formBuilder.control(''),
    allergies: this.formBuilder.control<number | null>(null),
    allergiesOther: this.formBuilder.control(''),
    medicalInformation: this.formBuilder.control(''),
  });

  constructor() {
    effect(() => {
      const student = this.studentService.student();

      if (!student) {
        return;
      }

      this.logger.debug('Updating personal info form from student signal', student);

      this.personalInfoForm.patchValue({
        name: student.name,
        englishName: student.englishName,
        citizenship: student.citizenship,
        travelDocument: student.travelDocument,
        email: student.email,
        gender: student.gender,
        dob: student.dob,
        guardianName: student.guardianName,
        emergencyContact: student.emergencyContact,
        house: student.house,
        roomNumber: student.roomNumber,
        homeroom: student.homeroom,
        grade: student.grade,
        studentId: student.studentId,
        wechatId: student.wechatId,
        dietaryRequirements: student.dietaryRequirements,
        dietaryRequirementsOther: student.dietaryRequirementsOther,
        allergies: student.allergies,
        allergiesOther: student.allergiesOther,
        medicalInformation: student.medicalInformation,
      });
    });
  }

  ngOnInit(): void {
    this.logger.debug('PersonalInfoComponent OnInit');
    this.lang = this.translate.getCurrentLang()?.includes('zh') ? 'zh' : 'en';
    this.fetchContents();
  }

  // TODO: This documents are small enough that could go into the translations
  fetchContents() {
    const isStudent = this.auth.isStudentSignal();
    this.namePromptContent$ = this.fetchDocumentById(isStudent ? 145 : 146);
    this.englishNamePromptContent$ = this.fetchDocumentById(isStudent ? 147 : 142);
    this.requiredFieldsPromptContent$ = this.fetchDocumentById(144);
  }

  fetchDocumentById(id: number): Observable<any> {
    return this.api
      .get(`documents/${id}`)
      .pipe(map((content: any) => (this.lang === 'zh' ? content.text_zh : content.text)));
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

  get studentId() {
    return this.personalInfoForm.get('studentId');
  }

  /** Handle form submission */
  async submitPersonalInfoForm(): Promise<void> {
    this.logger.debug('PersonalInfoComponent::submitPersonalInfoForm()');

    if (this.idPhotoRequired && !this.idPhotoProvided) {
      this.logger.debug('PersonalInfoComponent no photo ID provided yet, preventing submission.');

      this.snackBar.open(this.translate.instant('PIF_WARNING_PROVIDE_ID_PHOTO'), undefined, {
        duration: 3000,
      });

      this.photoIdElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      return;
    }

    const studentData = this.sanitizeData(this.personalInfoForm.value);
    try {
      await this.studentService.updateStudent(studentData);
      const student = this.studentService.student();
      this.logger.debug('PersonalInfoComponent: updated student data', student);
      if (student === null) {
        throw Error('Got empty student data');
      }
      const snackBarRef = this.snackBar.open(
        this.translate.instant('PERSONAL_INFO_UPDATED'),
        undefined,
        { duration: 3000 },
      );

      await firstValueFrom(snackBarRef.afterDismissed());

      await this.router.navigateByUrl(student.waiverAccepted ? '/home' : '/waiver');
    } catch (err) {
      this.logger.error('PersonalInfoComponent: Error updating student data', err);
      // TODO: Display the error in the UI
    }
  }

  /** Compare number select values to determine if we have a value already. */
  intValueCompare(v: any, c: any): boolean {
    return +v === +c;
  }

  /** Handle child component boolean output. */
  handleIdUploadEvent(success: boolean): void {
    this.idPhotoProvided = success;
  }

  /** Sanitize the data entered by the user before sending it to the server. */
  sanitizeData(data: any): any {
    const sanitizedData: any = {
      name: data.name,
      english_name: data.englishName,
      citizenship: data.citizenship,
      travel_document: data.travelDocument,
      email: data.email,
      gender: data.gender,
      guardian_name: data.guardianName,
      emergency_contact: data.emergencyContact,
      house: data.house,
      room_number: data.roomNumber,
      grade: data.grade,
      homeroom: data.homeroom,
      student_id: data.studentId,
      wechat_id: data.wechatId,
      waiver_accepted: data.waiverAccepted,
      waiver_signed_on: data.waiverSignedOn,
      dietary_requirements: data.dietaryRequirements,
      dietary_requirements_other: data.dietaryRequirementsOther,
      allergies: data.allergies,
      allergies_other: data.allergiesOther,
      medical_information: data.medicalInformation,
    };
    if (data.dob) {
      sanitizedData.dob = this.sanitizeDate(data.dob);
    }
    return sanitizedData;
  }

  /**
   * Validate a date and prepare it to be sent to the server.
   * @param dateString
   * @returns
   */
  sanitizeDate(dateString: string): string | null {
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      this.logger.error(`Failed to format date ${dateString}`);
      return null;
    }
    // const res = dateObject.toISOString().substring(0, 10);
    const res = formatDate(dateObject, 'yyyy-MM-dd', 'en-US');
    this.logger.debug(`Converted field value ${dateString} to YYYY-mm-dd ${res}`);
    return res;
  }
}
