import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';

import { Student } from '@models/student';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);

  private initialized: boolean = false;
  private readonly _student$ = new BehaviorSubject<Student | null>(null);
  readonly student$ = this._student$.pipe(distinctUntilChanged());

  init(): void {
    if (!this.initialized) {
      this.fetch();
    }
  }

  private fetch(): void {
    const endpoint = 'students/' + this.auth.credentials?.studentId;
    this.api.get(endpoint).subscribe({
      next: (studentJson) => {
        this.logger.debug('StudentService got student json from server', studentJson);
        this._student$.next(new Student(studentJson, this.translate));
        this.initialized = true;
      },
      error: (err) => this.logger.error('StudentService::fetch Error', err),
    });
  }

  /**
   * Performs a request to the student/update endpoint and returns the
   * HttpClient.patch observable.
   * @param data
   * @returns An HttpClient observable that will close on response.
   */
  updateStudent(data: any): Observable<Student> {
    const endpoint = 'students/' + this.auth.credentials?.studentId;
    return this.api.patch(endpoint, data).pipe(
      map((studentJson) => {
        const student = new Student(studentJson, this.translate);
        this._student$.next(student);
        return student;
      }),
    );
  }
}
