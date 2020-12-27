import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
})
export class ParticipantsComponent implements OnInit {
  participant$: Observable<Student[]>;
  displayedColumns: string[] = [
    'id',
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
        const studentsArray = studentsJson.map(
          (s: any) => new Student(s, this.translate, this.logger)
        );
        return studentsArray;
      })
    );
  }
}
