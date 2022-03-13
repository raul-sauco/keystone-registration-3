import { Trip } from 'src/app/models/trip';
import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { AddParticipantComponent } from 'src/app/components/add-participant/add-participant.component';
import { Student } from 'src/app/models/student';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantsComponent implements OnInit {
  participant$!: Observable<Student[]>;
  displayedColumns: string[];
  canDetermineTrip = true;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    private dialog: MatDialog,
    private paymentService: PaymentService,
    private translate: TranslateService,
    private tripSwitcher: TripSwitcherService,
    private snackBar: MatSnackBar
  ) {
    this.displayedColumns = [
      'index',
      'type',
      'firstName',
      'lastName',
      ...(this.paymentService.getPaymentInfo()?.required ? ['paid'] : []),
      ...(this.paymentService.getPaymentInfo()?.required
        ? ['paymentVerified']
        : []),
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

  ngOnInit(): void {
    this.logger.debug('ParticipantsComponent OnInit');
    this.loadStudentData();
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
   * Subscribe to the ApiService to get student data
   */
  private fetch(tripId?: number): void {
    this.logger.debug('ParticipantsComponent fetch() called');
    const endpoint = tripId ? `students?trip-id=${tripId}` : 'students';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.participant$ = this.api.get(endpoint, null, options).pipe(
      map((studentsJson: any) => {
        const studentsArray = studentsJson
          .map((s: any) => new Student(s, this.translate, this.logger))
          .sort(
            // Sort by type first and then last name.
            // Strings can be null strings do not use localCompare
            (a: Student, b: Student) => {
              const t = (b.type || 0) - (a.type || 0);
              if (t) {
                return t;
              }
              if (!a.lastName) {
                return 1;
              }
              if (!b.lastName) {
                return -1;
              }
              return a.lastName.localeCompare(b.lastName);
            }
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
      })
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
      attr === 'firstName' ||
      attr === 'lastName' ||
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
        (letter) => `_${letter.toLowerCase()}`
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
        (letter) => `_${letter.toLowerCase()}`
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
          { duration: 2000 }
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
      }
    );
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.loadStudentData();
        this.snackBar.open(
          this.translate.instant('PARTICIPANT_DELETED'),
          undefined,
          { duration: 2000 }
        );
      }
    });
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
    @Inject(MAT_DIALOG_DATA) public data: Student
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
      }
    );
  }

  /**
   * User cancels participant delete.
   */
  cancelDelete() {
    this.dialogRef.close(false);
  }
}
