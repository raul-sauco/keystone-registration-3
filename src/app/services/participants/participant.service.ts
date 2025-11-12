import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs';

import { Student } from '@models/student';
import { ApiService } from '@services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private api = inject(ApiService);
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);

  private initialized: boolean = false;
  private readonly _participants = signal<Student[] | null>(null);
  readonly participants = this._participants.asReadonly();

  init(): void {
    if (!this.initialized) {
      this.fetch();
    }
  }

  refresh(): void {
    this.fetch();
  }

  private fetch(): void {
    this.api.get('participants').pipe(
      map((studentsJson: any) => {
        const studentsArray = studentsJson
          .map((s: any) => new Student(s, this.translate))
          .sort(
            // Sort by type first and then last name.
            // Strings can be null strings do not use localCompare
            (a: Student, b: Student) => {
              const t = (b.type || 0) - (a.type || 0);
              if (t) {
                return t;
              }
              if (!a.name) {
                return 1;
              }
              if (!b.name) {
                return -1;
              }
              return a.name.localeCompare(b.name);
            },
          );

        // Add an index value to all
        let ti = 1;
        let si = 1;
        const indexedStudentArray: Student[] = [];
        studentsArray.forEach((student: Student) => {
          if (!student.type) {
            student.index = ti++;
          } else {
            student.index = si++;
          }
          indexedStudentArray.push(student);
        });
        return indexedStudentArray;
      }),
    ).subscribe({
      next: (participants: Student[]) => {
        this._participants.set(participants);
        this.logger.debug('ParticipantService fetched participants info');
        this.initialized = true;
      },
      error: (err) => this.logger.error('ParticipantService. Error fetching participant info', err),
    });
  }

  sortBy(attr: string, direction: string): void {
    this._participants.update((data: Student[] | null) => {
      if (data !== null) {
        const copy = [...data];
        copy.sort((a, b) => {
          const isAsc = direction === 'asc';
          return this.compareStudentAttributeValues(
            a.getAttributeText(attr as keyof Student),
            b.getAttributeText(attr as keyof Student),
            isAsc,
          );
        });
        return copy;
      }
      return data;
    });
  }

  /**
   * Compare two values of the same type obtained from a Student attribute.
   * @param a the first value.
   * @param b the second value.
   * @param isAsc whether to sort in ascending order.
   * @returns number indicating the order of the values.
   */
  private compareStudentAttributeValues(
    a: number | string,
    b: number | string,
    isAsc: boolean,
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
