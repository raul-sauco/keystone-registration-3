import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass, formatDate } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatIconButton, MatFabButton, MatButton } from '@angular/material/button';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort, MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { AddParticipantComponent } from '@components/add-participant/add-participant.component';
import { AdminBannerComponent } from '@components/admin-banner/admin-banner.component';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { School } from '@models/school';
import { Student } from '@models/student';
import { CamelToSnakePipe } from '@pipes/camel-to-snake.pipe';
import { ApiService } from '@services/api/api.service';
import { ParticipantService } from '@services/participants/participant.service';
import { SchoolService } from '@services/school/school.service';
import { TripService } from '@services/trip/trip.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    AdminBannerComponent,
    CamelToSnakePipe,
    LoadingSpinnerContentComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFabButton,
    MatFormField,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatOption,
    MatRow,
    MatRowDef,
    MatSelect,
    MatSort,
    MatSortHeader,
    MatSuffix,
    MatTable,
    NgClass,
    TranslatePipe,
  ],
})
export class ParticipantsComponent implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private logger = inject(NGXLogger);
  private schoolService = inject(SchoolService);
  private translate = inject(TranslateService);
  private tripService = inject(TripService);

  participantService = inject(ParticipantService);
  canDetermineTrip = true;
  school: School | null = null;

  ngOnInit(): void {
    this.logger.debug('ParticipantsComponent OnInit');
    this.subscribeToUpdates();
    this.participantService.init();
  }

  get allColumns(): string[] {
    return ['index', ...this.displayedColumns];
  }

  get displayedColumns(): string[] {
    return [
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

  get sortableColumns(): string[] {
    return [
      'type',
      'name',
      'englishName',
      'house',
      'roomNumber',
      'paid',
      'paymentVerified',
      'citizenship',
      'waiverAccepted',
      'waiverSignedOn',
    ];
  }

  /**
   * Subscribe to updates from the services used by the component.
   * Keep this subscriptions alive for the lifetime of the component.
   */
  private subscribeToUpdates(): void {
    // School service updates.
    this.schoolService.school$.subscribe({
      next: (school: School) => {
        this.logger.debug('ParticipantsComponent school$ next', school);
        this.school = school;
        // Some of the columns are displayed conditionally based on the school
        // data. Refresh the list of displayed columns.
        // this.displayedColumns = this.getDisplayedColumns();
      },
      error: (err: any) => this.logger.warn(err),
    });
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
    return this.tripService.trip?.acceptDirectPayment ?? false;
  }

  /**
   * Let the current user add a new participant to the system.
   */
  addParticipant(): void {
    const dialogRef = this.dialog.open(AddParticipantComponent);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.participantService.refresh();
      }
    });
  }

  // The following section deals with editable table fields.

  getAttrType(attr: string): string {
    if (
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
    const dob = event.value;
    if (dob instanceof Date && !isNaN(dob.getTime())) {
      // Format date as YYYY-MM-DD using Angular's formatDate
      const dobString = formatDate(dob, 'yyyy-MM-dd', 'en-US');
      this.updateStudentInfo(student, { dob: dobString });
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
    this.api.patch(endpoint, data).subscribe({
      next: (_res: any) => {
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
        this.participantService.refresh();
        this.snackBar.open(
          this.translate.instant('PARTICIPANT_DELETED'),
          undefined,
          { duration: 2000 },
        );
      }
    });
  }

  /**
   * Sort the participant data based on the selected column content and selected direction.
   */
  sortData(event: Sort) {
    this.logger.debug(`Sorting data by ${event.active} ${event.direction}`);
    const attribute = event.active;
    const direction = event.direction;
    if (!attribute || !this.sortableColumns.includes(attribute)) {
      return;
    }
    this.participantService.sortBy(attribute, direction);
  }
}

@Component({
  selector: 'app-delete-student-confirmation-dialog-component',
  templateUrl: './delete-student-confirmation-dialog.component.html',
  styleUrls: ['./delete-student-confirmation-dialog.component.scss'],
  imports: [
    CdkScrollable,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatProgressSpinner,
    TranslatePipe,
  ],
})
export class DeleteStudentConfirmationDialogComponent {
  private api = inject(ApiService);
  private logger = inject(NGXLogger);
  dialogRef = inject<MatDialogRef<DeleteStudentConfirmationDialogComponent>>(MatDialogRef);
  data = inject<Student>(MAT_DIALOG_DATA);

  public loading = false;
  public deleteError = false;

  /**
   * User confirms participant delete.
   */
  confirmDelete() {
    this.deleteError = false;
    this.loading = true;
    this.logger.debug(`Sending DELETE for student ${this.data.id}`);
    const endpoint = `students/${this.data.id}`;
    this.api.delete(endpoint).subscribe(
      {
        next: () => { this.dialogRef.close(true); },
        error: (error: any) => {
          this.logger.error(`Error deleting student ${this.data.id}`, error);
          this.deleteError = true;
        },
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
