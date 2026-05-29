import { Injectable, effect, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { Credentials } from '@models/credentials';
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

  private readonly _student = signal<Student | null>(null);
  readonly student = this._student.asReadonly();

  constructor() {
    effect(() => {
      const authenticated = this.auth.authenticated();
      const credentials = this.auth.credentialsSignal();
      if (!authenticated || !credentials) {
        this.logger.info('StudentService: No auth or credentials, setting student to null');
        this._student.set(null);
        return;
      }
      this.logger.info('StudentService: has credentials, fetching student info');
      this.fetchStudent(credentials);
    });
  }

  private async fetchStudent(credentials: Credentials): Promise<void> {
    this.logger.debug(`StudentService::fetchStudent ${credentials.studentId}`);
    try {
      const studentJson = await this.api.getAsync(`students/${credentials.studentId}`);
      this.logger.debug('StudentService got student json from server', studentJson);
      this._student.set(new Student(studentJson, this.translate));
    } catch (err: any) {
      this.logger.error('StudentService: Error fetching student', err, credentials);
    }
  }

  async updateStudent(data: any): Promise<void> {
    const credentials = this.auth.credentialsSignal();
    if (!credentials) {
      return;
    }
    try {
      const studentJson = await this.api.patchAsync(`students/${credentials.studentId}`, data);
      this.logger.debug('StudentService::updateStudent got student json from server', studentJson);
      this._student.set(new Student(studentJson, this.translate));
    } catch (err: any) {
      this.logger.error('StudentService::updateStudent Error patching student', err, credentials);
    }
  }
}
