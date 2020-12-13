import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student } from 'src/app/models/student';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-waiver',
  templateUrl: './waiver.component.html',
  styleUrls: ['./waiver.component.scss'],
})
export class WaiverComponent implements OnInit {
  needsLogin = false;
  student$: Observable<Student>;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private snackBar: MatSnackBar,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('WaiverComponent OnInit');
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
        return s;
      })
    );
  }

  /** Mark the student as having accepted the waiver today. */
  acceptWaiver(): void {
    const endpoint = 'students/' + this.auth.getCredentials().studentId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    const studentData = {
      waiver_accepted: 1,
      waiver_signed_on: moment().format('YYYY-MM-DD'),
    };
    this.student$ = this.api.patch(endpoint, studentData, options).pipe(
      map((studentJson: any) => {
        const s = new Student(studentJson, this.translate, this.logger);
        this.logger.debug('Updated student waiver data on backend', s);
        this.snackBar.open(
          this.translate.instant('PERSONAL_INFO_UPDATED'),
          null,
          { duration: 3000 }
        );
        return s;
      })
    );
  }
}
