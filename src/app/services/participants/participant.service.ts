import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { map, Observable, tap } from 'rxjs';

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
          .sort((a: Student, b: Student) => a.cmp(b));
        return studentsArray;
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

  updateParticipantInfo(participant: Student, data: any): Observable<ArrayBuffer> {
    return this.api.patch(`students/${participant.id}`, data).pipe(
      tap({
        next: (_res: any) => {
          // UI matches server state, no need to update.
          this.logger.debug(`ParticipantService. Updated participant ${participant.id} information`);
        },
        error: (error: any) => {
          // Update the UI to reflect that the update failed.
          this._participants.update((data: Student[] | null) => [...(data ?? [])]);
          this.logger.error(
            `ParticipantService. Error updating participant ${participant.id} information`,
            error,
          );
        }
      }),
    );
  }

  sortBy(attr: string, direction: string): void {
    this.logger.debug(`ParticipantService: Sorting by "${attr}:${direction}"`);
    this._participants.update((data: Student[] | null) => {
      if (data !== null) {
        const copy = [...data];
        copy.sort((a, b) => {
          switch (direction) {
            case 'asc':
              return b.cmp(a, attr as keyof Student);
            case 'desc':
              return a.cmp(b, attr as keyof Student);
            default:
              return a.cmp(b);
          }
        });
        return copy;
      }
      return data;
    });
  }
}
