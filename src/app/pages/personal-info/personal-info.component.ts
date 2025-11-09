import { formatDate, AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MarkdownComponent } from 'ngx-markdown';
import { Observable, Subject, filter, map, takeUntil } from 'rxjs';

import { IdPhotoComponent } from './id-photo/id-photo.component';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { Student } from '@models/student';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { SchoolService } from '@services/school/school.service';
import { StudentService } from '@services/student/student.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
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
export class PersonalInfoComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private formBuilder = inject(UntypedFormBuilder);
  private snackBar = inject(MatSnackBar);
  private logger = inject(NGXLogger);
  private router = inject(Router);
  private translate = inject(TranslateService);
  schoolService = inject(SchoolService);
  studentService = inject(StudentService);
  auth = inject(AuthService);

  @ViewChild('photoId') photoIdElement!: ElementRef;
  private readonly destroy$ = new Subject<void>();
  personalInfoForm!: UntypedFormGroup;
  idPhotoProvided = false;
  idPhotoRequired = false;
  lang: string = 'en';
  namePromptContent$!: Observable<any>;
  englishNamePromptContent$!: Observable<any>;
  requiredFieldsPromptContent$!: Observable<any>;

  ngOnInit(): void {
    this.logger.debug('PersonalInfoComponent OnInit');
    this.lang = this.translate.getCurrentLang().includes('zh') ? 'zh' : 'en';
    this.studentService.student$
      .pipe(
        filter((student): student is Student => student !== null),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (student: Student) => {
          this.logger.debug(
            'PersonalInfoComponent: student$ subscription update',
            student,
          );
          this.initPersonalInfoForm(student);
          this.idPhotoRequired = student.idPhotoRequired;
        },
        error: (error: any) => {
          this.logger.error(
            'PersonalInfoComponent StudentService student$ error',
            error,
          );
        },
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
    return this.api
      .get(`documents/${id}`)
      .pipe(
        map((content: any) =>
          this.lang === 'zh' ? content.text_zh : content.text,
        ),
      );
  }

  ngOnDestroy(): void {
    this.logger.debug('PersonalInfoComponent on destroy');
    this.destroy$.next();
    this.destroy$.complete();
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
      homeroom: [student.homeroom],
      grade: [student.grade],
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
    this.logger.debug('PersonalInfoComponent::submitPersonalInfoForm()');
    if (this.idPhotoRequired && !this.idPhotoProvided) {
      this.logger.debug(
        'PersonalInfoComponent no photo ID provided yet, preventing submission.',
      );
      this.snackBar.open(
        this.translate.instant('PIF_WARNING_PROVIDE_ID_PHOTO'),
        undefined,
        { duration: 3000 },
      );
      this.logger.debug(this.photoIdElement.nativeElement);
      this.photoIdElement.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }
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
    this.logger.debug(
      `Converted field value ${dateString} to YYYY-mm-dd ${res}`,
    );
    return res;
  }
}
