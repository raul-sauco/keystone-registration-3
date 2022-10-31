import { HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

import { School } from 'src/app/models/school';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private SCHOOL_SERVICE_STORAGE_KEY =
    'KEYSTONE_ADVENTURES_SCHOOL_SERVICE_STORAGE_KEY';
  school$: BehaviorSubject<School> = new BehaviorSubject(new School({}));
  private school?: School;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private storage: StorageService
  ) {
    this.logger.debug('SchoolService constructor');
    this.auth.checkAuthenticated().then((res) => {
      if (res && !this.auth.isSchoolAdmin) {
        this.loadFromStorage();
      }
    });
  }

  /**
   * School getter.
   */
  getSchool(): School | undefined {
    return this.school;
  }

  /**
   * Load school data from storage, if not found it will launch a network
   * request.
   */
  loadFromStorage(): void {
    this.storage.get(this.SCHOOL_SERVICE_STORAGE_KEY).then((json) => {
      if (json) {
        this.school = new School(json);
        this.school$.next(this.school);
        if (json.ttl > Date.now()) {
          this.logger.debug('SchoolService found valid info in storage', json);
          return;
        }
        this.logger.debug(
          'SchoolService found expired info in storage, fetching from server',
          json
        );
      } else {
        this.logger.debug('SchoolService found no info in storage');
      }
      this.fetchFromServer();
    });
  }

  /**
   * Launch a network request to fetch school data.
   */
  fetchFromServer(): void {
    this.auth.checkAuthenticated().then((res) => {
      if (res) {
        const endpoint = 'school-details';
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (this.auth.getCredentials()?.accessToken) {
          headers = headers.append(
            'Authorization',
            `Bearer ${this.auth.getCredentials()?.accessToken}`
          );
        }
        const options = { headers };
        this.api.get(endpoint, null, options).subscribe({
          next: (schoolData: any) => {
            this.logger.debug(
              'SchoolService got school data from server',
              schoolData
            );
            // Construct a new School object from the data.
            this.school = new School(schoolData);
            // Send the new school data to the subscribers.
            this.school$.next(this.school);
            // Add a TTL field to the school data, 10 minutes.
            schoolData.ttl = isDevMode()
              ? Date.now()
              : Date.now() + 1000 * 60 * 10;
            // Save the school data to local storage. Use JSON format.
            this.storage.set(this.SCHOOL_SERVICE_STORAGE_KEY, schoolData);
          },
          error: (err: any) => {
            this.logger.warn('SchoolService error fetching school data', err);
          },
        });
      }
    });
  }
}
