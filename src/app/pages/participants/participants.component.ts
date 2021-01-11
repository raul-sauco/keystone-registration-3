import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
    private translate: TranslateService
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
}
