import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TripService } from 'src/app/services/trip/trip.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';

export interface DialogData {
  title: string;
  content: string;
  lang: string;
}

@Component({
  selector: 'app-trip-codes',
  templateUrl: './trip-codes.component.html',
  styleUrls: ['./trip-codes.component.scss']
})
export class TripCodesComponent implements OnInit {

  tripCodeForm: FormGroup;
  tripId: string = null;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private trip: TripService,
    private logger: NGXLogger,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.tripId = params.get('id');
      this.initTripCodeForm();
    });
  }

  /**
   * Initializes the first form of the registration that collects
   * the trip's id and code that students/teachers need to use to
   * register for the trip.
   */
  initTripCodeForm(): void {
    this.tripCodeForm = this.formBuilder.group({
      tripId: [{
        value: this.tripId,
        disabled: this.tripId
      }, Validators.required],
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ])]
    });
  }

  /**
   * Get the trip ID and registration security code from
   * the user and verify them against the server.
   */
  submitTripCodes() {
    const params = {
      id: this.tripId || this.tripCodeForm.value.tripId,
      code: this.tripCodeForm.value.code,
      lang: this.translate.currentLang
    };
    const endpoint = 'trip-codes';
    this.loading = true;
    this.api.post(endpoint, params).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.error === false &&
          this.trip.setCodeValues(response)) {
            this.router.navigateByUrl('/register');
        } else {
          this.resetForm();
          this.dialog.open(CodeErrorDialogComponent, {
            data: {title: 'ERROR', content: 'WRONG_CODES'}
          });
        }
      }, (error: any) => {
        this.resetForm();
        this.loading = false;
        this.logger.warn('Error posting trip-codes', params, error);
        this.dialog.open(CodeErrorDialogComponent, {
          data: {title: 'ERROR', content: 'SERVER_ERROR'}
        });
      }
    );
  }

  /**
   * Reset the form to it's initial state after a server
   * error or a failed attempt
   */
  resetForm(): void {
    this.tripCodeForm.controls.code.setValue('');
    this.tripCodeForm.controls.code.setErrors(null);
  }

  /**
   * Show a dialog with help content related to the trip codes
   */
  showHelp() {
    this.dialog.open(TripCodeHelpDialogComponent, {
      data: {lang: this.translate.currentLang}
    });
  }
}

@Component({
  selector: 'app-code-error-dialog-component',
  templateUrl: './code-error-dialog.component.html'
})
export class CodeErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CodeErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-trip-code-help-dialog-component',
  templateUrl: './trip-code-help-dialog.component.html'
})
export class TripCodeHelpDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TripCodeHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  dismiss() {
    this.dialogRef.close();
  }
}
