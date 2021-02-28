import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
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
  selector: 'app-waiver',
  templateUrl: './waiver.component.html',
  styleUrls: ['./waiver.component.scss'],
})
export class WaiverComponent implements OnInit {
  needsLogin = false;
  posting = false;
  student$: Observable<Student>;
  waiverForm: FormGroup;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private formBuilder: FormBuilder,
    private logger: NGXLogger,
    private router: Router,
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

  get firstName() {
    return this.waiverForm.get('firstName');
  }
  get lastName() {
    return this.waiverForm.get('lastName');
  }
  get guardianName() {
    return this.waiverForm.get('guardianName');
  }

  initWaiverForm(stu: Student): void {
    this.waiverForm = this.formBuilder.group({
      firstName: [stu.firstName || '', Validators.required],
      lastName: [stu.lastName || '', Validators.required],
      guardianName: [
        stu.guardianName || '',
        this.auth.getCredentials().type === 4 ? null : Validators.required,
      ],
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
        this.initWaiverForm(s);
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
      first_name: this.waiverForm.value.firstName,
      last_name: this.waiverForm.value.lastName,
      guardian_name: this.waiverForm.value.guardianName,
      waiver_accepted: 1,
      waiver_signed_on: moment().format('YYYY-MM-DD'),
    };
    this.posting = true;
    this.api.patch(endpoint, studentData, options).subscribe(
      (res: any) => {
        // Try to construct a Student to get error reporting.
        const s = new Student(res, this.translate, this.logger);
        this.router.navigateByUrl('/personal-info');
      },
      (error: any) => {
        this.logger.error(`Error sending waiver`, error);
      }
    );
  }
}
