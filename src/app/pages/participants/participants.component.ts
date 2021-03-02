import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { Student } from 'src/app/models/student';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantsComponent implements OnInit {
  participant$: Observable<Student[]>;
  displayedColumns: string[] = [
    'index',
    'type',
    'firstName',
    'lastName',
    'citizenship',
    'travelDocument',
    'gender',
    'dob',
    'guardianName',
    'waiverAccepted',
    'waiverSignedOn',
    'dietaryRequirements',
    'dietaryRequirementsOther',
    'allergies',
    'allergiesOther',
    'medicalInformation',
    'insurance',
    'insuranceName',
    'insurancePolicyNumber',
  ];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.logger.debug('Participants component OnInit');
    this.fetch();
  }

  /**
   * Subscribe to the ApiService to get student data
   */
  fetch(): void {
    this.logger.debug('FeedbackComponent fetch() called');
    const endpoint = 'students';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    this.participant$ = this.api.get(endpoint, null, options).pipe(
      map((studentsJson: any) => {
        const studentsArray = studentsJson
          .map((s: any) => new Student(s, this.translate, this.logger))
          .sort(
            // Sort by type first and then last name.
            // Strings can be null strings do not use localCompare
            (a: Student, b: Student) => {
              const t = b.type - a.type;
              if (t) {
                return t;
              }
              if (!a.lastName) {
                return 1;
              }
              if (!b.lastName) {
                return -1;
              }
              return a.lastName.localeCompare(b.lastName);
            }
          );

        // Add an index value to all
        let ti = 1;
        let si = 1;
        const indexedStudentArray = [];
        studentsArray.forEach((student: Student) => {
          if (!student.type) {
            student.index = ti++;
          } else {
            student.index = si++;
          }
          indexedStudentArray.push(student);
        });
        return indexedStudentArray;
      })
    );
  }

  // The following section deals with editable table fields.

  getAttrType(attr: string): string {
    if (
      attr === 'index' ||
      attr === 'type' ||
      attr === 'waiverAccepted' ||
      attr === 'waiverSignedOn'
    ) {
      return 'non-editable';
    }
    if (
      attr === 'firstName' ||
      attr === 'lastName' ||
      attr === 'citizenship' ||
      attr === 'travelDocument' ||
      attr === 'guardianName' ||
      attr === 'dietaryRequirementsOther' ||
      attr === 'allergiesOther' ||
      attr === 'medicalInformation' ||
      attr === 'insuranceName' ||
      attr === 'insurancePolicyNumber'
    ) {
      return 'inline';
    }
    return attr;
  }

  /** Compare number select values to determine if we have a value already. */
  intValueCompare(v: any, c: any): boolean {
    return +v === +c;
  }

  /**
   * Handle focus out event on inline content-editable fields.
   */
  handleFocusOut(event, attr: string, student: Student) {
    const updatedValue = event.currentTarget.textContent.trim();
    const attrSnakeCase = attr.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
    if (updatedValue !== '' && updatedValue !== student[attr]) {
      this.updateStudentInfo(student, { [attrSnakeCase]: updatedValue });
    }
  }

  /**
   * Respond to select fields "focusout" events.
   * @param event Event
   * @param attr string, the attribute the select.
   * @param student Student.
   */
  handleSelectFocusOut(event, attr: string, student: Student) {
    const updatedValue = student[attr];
    const attrSnakeCase = attr.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
    // TODO this update happens twice, find a way to only update when the value has changed.
    this.updateStudentInfo(student, { [attrSnakeCase]: updatedValue });
  }

  /**
   * Handle changes on the DOB field.
   * @param event DateChange event.
   * @param student Student.
   */
  handleDobChange(event, student: Student): void {
    // The event contains a moment date object.
    const dob = event.value;
    if (moment.isMoment(dob) && dob.isValid()) {
      this.updateStudentInfo(student, { dob: dob.format('YYYY-MM-DD') });
    } else {
      // The date object is not valid.
      this.snackBar.open(this.translate.instant('DATE_NOT_VALID'), null, {
        duration: 3000,
      });
    }
  }

  /**
   * Post updated Student data to the backend.
   * @param id the ID of the `Student` model to update.
   * @param data an object with updated attribute names and values.
   */
  updateStudentInfo(student: Student, data: any): void {
    const endpoint = `students/${student.id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    this.api.patch(endpoint, data, options).subscribe(
      (res: any) => {
        this.snackBar.open(
          this.translate.instant('INFORMATION_UPDATED'),
          null,
          { duration: 2000 }
        );
      },
      (error: any) => {
        this.logger.error(`Error updating student ${student.id}`, error);
        this.snackBar.open(error.error.message, null, { duration: 2000 });
      }
    );
  }
}
