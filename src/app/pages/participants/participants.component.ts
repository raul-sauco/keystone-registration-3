import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AddParticipantComponent } from '@components/add-participant/add-participant.component';
import { School } from '@models/school';
import { Student } from '@models/student';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { SchoolService } from '@services/school/school.service';
import { TripSwitcherService } from '@services/trip-switcher/trip-switcher.service';
import { TripService } from '@services/trip/trip.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantsComponent implements OnInit {
  participant$!: Observable<Student[]>;
  displayedColumns: string[];
  sortableColumns: string[];
  canDetermineTrip = true;
  school: School | null = null;
  sortedParticipants: Student[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private dialog: MatDialog,
    private schoolService: SchoolService,
    private translate: TranslateService,
    private tripService: TripService,
    private tripSwitcher: TripSwitcherService,
    private snackBar: MatSnackBar,
  ) {
    this.displayedColumns = this.getDisplayedColumns();
    this.sortableColumns = [
      // 'index',
      'type',
      'name',
      'englishName',
      'house',
      'roomNumber',
      'paid',
      'paymentVerified',
      'citizenship',
      // 'travelDocument',
      // 'gender',
      // 'dob',
      // 'guardianName',
      // 'emergencyContact',
      'waiverAccepted',
      'waiverSignedOn',
      // 'dietaryRequirements',
      // 'dietaryRequirementsOther',
      // 'allergies',
      // 'allergiesOther',
      // 'medicalInformation',
      // 'delete',
    ];
  }

  ngOnInit(): void {
    this.logger.debug('ParticipantsComponent OnInit');
    this.loadStudentData();
    this.subscribeToUpdates();
  }

  private getDisplayedColumns(): string[] {
    return [
      'index',
      'type',
      'name',
      'englishName',
      ...(this.school?.useHouse ? ['house'] : []),
      ...(this.school?.useRoomNumber ? ['roomNumber'] : []),
      ...(this.displayPaymentInfoColumns() ? ['paid'] : []),
      ...(this.displayPaymentInfoColumns() ? ['paymentVerified'] : []),
      'citizenship',
      'travelDocument',
      'gender',
      'dob',
      'guardianName',
      'emergencyContact',
      'waiverAccepted',
      'waiverSignedOn',
      'dietaryRequirements',
      'dietaryRequirementsOther',
      'allergies',
      'allergiesOther',
      'medicalInformation',
      'delete',
    ];
  }

  /**
   * Check component properties before fetch to load student data.
   */
  private loadStudentData() {
    // School administrators should be able to see multiple trips.
    if (this.auth.isSchoolAdmin) {
      if (this.tripSwitcher.selectedTrip) {
        this.fetch(this.tripSwitcher.selectedTrip.id);
      } else {
        this.canDetermineTrip = false;
        this.logger.debug('ParticipantsComponent cannot determine trip');
      }
    } else {
      this.fetch();
    }
  }

  /**
   * Subscribe to updates from the services used by the component.
   * Keep this subscriptions alive for the lifetime of the component.
   */
  private subscribeToUpdates(): void {
    this.participant$.subscribe({
      next: (students: Student[]) => {
        this.logger.debug('ParticipantsComponent participant$ next', students);
        this.sortedParticipants = students;
      },
      error: (err: any) => this.logger.warn(err),
    });
    // School service updates.
    this.schoolService.school$.subscribe({
      next: (school: School) => {
        this.logger.debug('ParticipantsComponent school$ next', school);
        this.school = school;
        // Some of the columns are displayed conditionally based on the school
        // data. Refresh the list of displayed columns.
        this.displayedColumns = this.getDisplayedColumns();
      },
      error: (err: any) => this.logger.warn(err),
    });
  }

  /**
   * Subscribe to the ApiService to get student data
   */
  private fetch(tripId?: number): void {
    this.logger.debug('ParticipantsComponent fetch() called');
    const endpoint = tripId ? `participants?trip-id=${tripId}` : 'participants';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.participant$ = this.api.get(endpoint, null, options).pipe(
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
    );
  }

  /**
   * The payment info columns are displayed conditionally, encapsulate the
   * display logic in a function.
   *
   * There are two situations under which the payment info columns are displayed:
   * - For regular users, check the acceptDirectPayment on the trip linked to their account.
   * - For school administrators, the trip.acceptDirectPayment attribute is set to true for
   * the trip that they are currently visualizing.
   */
  private displayPaymentInfoColumns(): boolean {
    return (
      (this.tripService.trip?.acceptDirectPayment ||
        (this.auth.isSchoolAdmin &&
          this.tripSwitcher.selectedTrip?.acceptDirectPayment)) ??
      false
    );
  }

  /**
   * Let the current user add a new participant to the system.
   */
  addParticipant(): void {
    const dialogRef = this.dialog.open(AddParticipantComponent);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.loadStudentData();
      }
    });
  }

  // The following section deals with editable table fields.

  getAttrType(attr: string): string {
    if (
      attr === 'index' ||
      attr === 'type' ||
      attr === 'waiverAccepted' ||
      attr === 'waiverSignedOn'
    ) {
      return 'non-editable';
    }
    if (
      attr === 'name' ||
      attr === 'englishName' ||
      attr === 'house' ||
      attr === 'roomNumber' ||
      attr === 'citizenship' ||
      attr === 'travelDocument' ||
      attr === 'guardianName' ||
      attr === 'emergencyContact' ||
      attr === 'dietaryRequirementsOther' ||
      attr === 'allergiesOther' ||
      attr === 'medicalInformation'
    ) {
      return 'inline';
    }
    return attr;
  }

  /** Compare number select values to determine if we have a value already. */
  intValueCompare(v: any, c: any): boolean {
    return +v === +c;
  }

  /**
   * Handle focus out event on inline content-editable fields.
   */
  handleFocusOut(event: any, attr: string, student: Student) {
    if (attr in student) {
      const studentKey = attr as keyof Student;
      const updatedValue: string = event.currentTarget.textContent.trim();
      const attrSnakeCase = attr.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      if (updatedValue !== student[studentKey]) {
        // TODO check if this line could be removed using Angular binding
        student.setAttribute(studentKey, updatedValue);
        this.updateStudentInfo(student, { [attrSnakeCase]: updatedValue });
      }
    }
  }

  /**
   * Respond to select fields "focusout" events.
   * @param event Event
   * @param attr string, the attribute the select.
   * @param student Student.
   */
  handleSelectFocusOut(_: any, attr: string, student: Student) {
    if (attr in student) {
      const studentKey = attr as keyof Student;
      const updatedValue = student[studentKey];
      const attrSnakeCase = attr.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      // TODO this update happens twice, find a way to only update when the value has changed.
      this.updateStudentInfo(student, { [attrSnakeCase]: updatedValue });
    }
  }

  /**
   * Handle changes on the DOB field.
   * @param event DateChange event.
   * @param student Student.
   */
  handleDobChange(event: any, student: Student): void {
    // The event contains a moment date object.
    const dob = event.value;
    if (moment.isMoment(dob) && dob.isValid()) {
      this.updateStudentInfo(student, { dob: dob.format('YYYY-MM-DD') });
    } else {
      // The date object is not valid.
      this.snackBar.open(this.translate.instant('DATE_NOT_VALID'), undefined, {
        duration: 3000,
      });
    }
  }

  /**
   * Post updated Student data to the backend.
   * @param id the ID of the `Student` model to update.
   * @param data an object with updated attribute names and values.
   */
  updateStudentInfo(student: Student, data: any): void {
    const endpoint = `students/${student.id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.api.patch(endpoint, data, options).subscribe({
      next: (res: any) => {
        this.snackBar.open(
          this.translate.instant('INFORMATION_UPDATED'),
          undefined,
          { duration: 2000 },
        );
      },
      error: (error: any) => {
        this.logger.error(`Error updating student ${student.id}`, error);
        this.snackBar.open(error.error.message, undefined, { duration: 2000 });
      },
    });
  }

  /**
   * Display a MatDialog asking for confirmation about deleting the student.
   * @param student Student
   */
  showDeleteConfirm(student: Student) {
    const dialogRef = this.dialog.open(
      DeleteStudentConfirmationDialogComponent,
      {
        data: student,
      },
    );
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.loadStudentData();
        this.snackBar.open(
          this.translate.instant('PARTICIPANT_DELETED'),
          undefined,
          { duration: 2000 },
        );
      }
    });
  }

  /**
   * Sort the participant data based on the selected column content and
   * selected direction.
   */
  sortData(event: Sort) {
    this.logger.debug(`Sorting data by ${event.active} ${event.direction}`);
    const data = this.sortedParticipants.slice();
    if (!event.active || event.direction === '') {
      this.sortedParticipants = data;
      return;
    }

    this.sortedParticipants = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      if (this.sortableColumns.includes(event.active)) {
        return this.compareStudentAttributeValues(
          a.getAttributeText(event.active as keyof Student),
          b.getAttributeText(event.active as keyof Student),
          isAsc,
        );
      }
      return 0;
    });
  }

  /**
   * Compare two values of the same type obtained from a Student attribute.
   * @param a the first value.
   * @param b the second value.
   * @param isAsc whether to sort in ascending order.
   * @returns number indicating the order of the values.
   */
  compareStudentAttributeValues(
    a: number | string,
    b: number | string,
    isAsc: boolean,
  ): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

@Component({
  selector: 'app-delete-student-confirmation-dialog-component',
  templateUrl: './delete-student-confirmation-dialog.component.html',
  styleUrls: ['./delete-student-confirmation-dialog.component.scss'],
})
export class DeleteStudentConfirmationDialogComponent {
  public loading = false;
  public deleteError = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    public dialogRef: MatDialogRef<DeleteStudentConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Student,
  ) {}

  /**
   * User confirms participant delete.
   */
  confirmDelete() {
    this.deleteError = false;
    this.loading = true;
    this.logger.debug(`Sending DELETE for student ${this.data.id}`);
    const endpoint = `students/${this.data.id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.api.delete(endpoint, options).subscribe(
      () => {
        this.dialogRef.close(true);
      },
      (error: any) => {
        this.logger.error(`Error deleting student ${this.data.id}`, error);
        this.deleteError = true;
      },
    );
  }

  /**
   * User cancels participant delete.
   */
  cancelDelete() {
    this.dialogRef.close(false);
  }
}
