import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      attr === 'gender' ||
      attr === 'dietaryRequirements' ||
      attr === 'allergies' ||
      attr === 'insurance'
    ) {
      return 'select';
    }
    if (attr === 'dob') {
      return 'date';
    }
    return 'inline';
  }

  handleClick(student: Student) {
    console.log(`Clicked cell for student ${student.id}`);
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
      console.log(
        `Student ${student.id} attribute "${attrSnakeCase}" updated from "${student[attr]}" to "${updatedValue}"`
      );
      this.updateStudentInfo(student, { [attrSnakeCase]: updatedValue });
    }
  }

  handleFocusIn(student: Student) {
    console.log(`Focus in cell for student ${student.id}`);
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
