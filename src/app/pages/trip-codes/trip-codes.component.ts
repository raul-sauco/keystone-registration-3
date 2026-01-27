import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, RouterLink } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { TripService } from 'src/app/services/trip/trip.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';

export interface DialogData {
  title: string;
  content: string;
  lang: string;
}

@Component({
    selector: 'app-trip-codes',
    templateUrl: './trip-codes.component.html',
    styleUrls: ['./trip-codes.component.scss'],
    imports: [MatCard, MatCardContent, MatIcon, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatProgressBar, MatButton, RouterLink, TranslatePipe]
})
export class TripCodesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private formBuilder = inject(UntypedFormBuilder);
  private trip = inject(TripService);
  private logger = inject(NGXLogger);
  dialog = inject(MatDialog);

  tripCodeForm!: UntypedFormGroup;
  tripId: string | null = null;
  loading: boolean = true;

  ngOnInit(): void {
    this.logger.debug('TripComponent OnInit');
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
      tripId: [
        {
          value: this.tripId,
          disabled: this.tripId,
        },
        Validators.required,
      ],
      code: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ]),
      ],
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
      lang: this.translate.currentLang,
    };
    const endpoint = 'trip-codes';
    this.loading = true;
    this.api.post(endpoint, params).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.error === false) {
          const tripData = {
            id: response.id,
            name: response.name,
            code: this.tripCodeForm.value.code,
            type: response.registration,
          };
          this.trip.setCodeValues(tripData);
          this.router.navigateByUrl('/register');
        } else {
          this.resetForm();
          this.dialog.open(CodeErrorDialogComponent, {
            data: { title: 'ERROR', content: 'WRONG_CODES' },
          });
        }
      },
      (error: any) => {
        this.resetForm();
        this.loading = false;
        this.logger.warn('Error posting trip-codes', params, error);
        this.dialog.open(CodeErrorDialogComponent, {
          data: { title: 'ERROR', content: 'SERVER_ERROR_TRY_LATER' },
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
      data: { lang: this.translate.currentLang },
    });
  }
}

@Component({
    selector: 'app-code-error-dialog-component',
    templateUrl: './code-error-dialog.component.html',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslatePipe]
})
export class CodeErrorDialogComponent {
  dialogRef = inject<MatDialogRef<CodeErrorDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);


  onClose() {
    this.dialogRef.close();
  }
}

@Component({
    selector: 'app-trip-code-help-dialog-component',
    templateUrl: './trip-code-help-dialog.component.html',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslatePipe]
})
export class TripCodeHelpDialogComponent {
  dialogRef = inject<MatDialogRef<TripCodeHelpDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);


  dismiss() {
    this.dialogRef.close();
  }
}
