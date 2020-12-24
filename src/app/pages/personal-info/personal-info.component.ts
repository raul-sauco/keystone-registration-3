import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student } from 'src/app/models/student';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  student$: Observable<Student>;
  student: Student;
  personalInfoForm: FormGroup;
  needsLogin = false;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private logger: NGXLogger,
    private translate: TranslateService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PersonalInfoComponent OnInit');
    this.auth.checkAuthenticated().then((res: boolean) => {
      if (res) {
        if (this.auth.getCredentials().accessToken) {
          if (this.auth.getCredentials().studentId) {
            this.fetch();
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

  get dob() {
    return this.personalInfoForm.get('dob');
  }

  initPersonalInfoForm(): void {
    this.personalInfoForm = this.formBuilder.group({
      firstName: [this.student.firstName],
      lastName: [this.student.lastName],
      citizenship: [this.student.citizenship],
      travelDocument: [this.student.travelDocument],
      gender: [this.student.gender],
      dob: [this.student.dob],
      guardianName: [this.student.guardianName],
      dietaryRequirements: [this.student.dietaryRequirements],
      dietaryRequirementsOther: [this.student.dietaryRequirementsOther],
      allergies: [this.student.allergies],
      allergiesOther: [this.student.allergiesOther],
      medicalInformation: [this.student.medicalInformation],
      insurance: [this.student.insurance],
      insuranceName: [this.student.insuranceName],
      insurancePolicyNumber: [this.student.insurancePolicyNumber],
    });
  }

  /**
   * Have the ApiService request student information.
   */
  fetch(): void {
    const endpoint = 'students/' + this.auth.getCredentials().studentId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    this.student$ = this.api.get(endpoint, null, options).pipe(
      map((studentJson: any) => {
        const s = new Student(studentJson, this.translate, this.logger);
        this.logger.debug('Fetched student from backend', s);
        this.student = s;
        this.initPersonalInfoForm();
        return s;
      })
    );
  }

  /** Handle form submission */
  submitPersonalInfoForm(): void {
    const endpoint = 'students/' + this.auth.getCredentials().studentId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    const studentData = this.sanitizeData(this.personalInfoForm.value);
    this.student$ = this.api.patch(endpoint, studentData, options).pipe(
      map((studentJson: any) => {
        const s = new Student(studentJson, this.translate, this.logger);
        this.logger.debug('Updated student data on backend', s);
        this.snackBar.open(
          this.translate.instant('PERSONAL_INFO_UPDATED'),
          null,
          { duration: 3000 }
        );
        this.student = s;
        this.initPersonalInfoForm();
        return s;
      })
    );
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
      waiver_accepted: data.waiverAccepted,
      waiver_signed_on: data.waiverSignedOn,
      dietary_requirements: data.dietaryRequirements,
      dietary_requirements_other: data.dietaryRequirementsOther,
      allergies: data.allergies,
      allergies_other: data.allergiesOther,
      medical_information: data.medicalInformation,
      insurance: data.insurance,
      insurance_name: data.insuranceName,
      insurance_policy_number: data.insurancePolicyNumber,
    };
    if (data.dob !== this.student.dob) {
      this.logger.debug('DOB field has been updated');
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
