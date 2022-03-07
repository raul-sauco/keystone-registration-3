import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, ReplaySubject, Subject, of, map } from 'rxjs';
import { Student } from 'src/app/models/student';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  student$: Subject<Student> = new ReplaySubject();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private translate: TranslateService
  ) {
    this.logger.debug('StudentService constructor');
    this.init();
  }

  init(): void {
    this.auth.checkAuthenticated().then((res) => {
      if (res && this.auth.getCredentials()?.type !== 8) {
        this.refreshStudent();
      }
    });
  }

  /**
   * Refresh student information from the server.
   */
  refreshStudent(): void {
    const endpoint = 'students/' + this.auth.getCredentials()?.studentId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.api.get(endpoint, null, options).subscribe({
      next: (studentJson) => {
        this.logger.debug(
          'StudentService got student json from server',
          studentJson
        );
        this.student$.next(
          new Student(studentJson, this.translate, this.logger)
        );
      },
    });
  }

  /**
   * Performs a request to the student/update endpoint and returns the
   * HttpClient.patch observable.
   * @param data
   * @returns An HttpClient observable that will close on response.
   */
  updateStudent(data: any): Observable<void> {
    const endpoint = 'students/' + this.auth.getCredentials()?.studentId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    return this.api.patch(endpoint, data, options).pipe(
      map((studentJson) => {
        const student = new Student(studentJson, this.translate, this.logger);
        this.student$.next(student);
      })
    );
  }
}
