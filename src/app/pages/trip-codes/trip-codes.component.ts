import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs';

import { InvalidTripCodeError } from '@app/models/error';
import { RegistrationService } from '@app/services/registration/registration.service';

export interface DialogData {
  title: string;
  content: string;
  lang: string;
}

@Component({
  selector: 'app-trip-codes',
  templateUrl: './trip-codes.component.html',
  styleUrls: ['./trip-codes.component.scss'],
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatProgressBar,
    MatButton,
    RouterLink,
    TranslatePipe,
  ],
})
export class TripCodesComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private formBuilder = inject(FormBuilder);
  private registrationService = inject(RegistrationService);
  private logger = inject(NGXLogger);
  dialog = inject(MatDialog);

  readonly tripId = toSignal(
    this.route.paramMap.pipe(map((params: ParamMap) => params.get('id'))),
    { initialValue: null },
  );

  tripCodeForm!: FormGroup;
  loading = signal(false);

  constructor() {
    this.logger.debug('TripComponent::constructor');
    effect(() => {
      const tripId = this.tripId();
      this.tripCodeForm = this.formBuilder.group({
        tripId: this.formBuilder.control(
          { value: tripId ?? '', disabled: !!tripId },
          { validators: [Validators.required] },
        ),
        code: this.formBuilder.control('', {
          validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
        }),
      });
    });
  }

  /**
   * Get the trip ID and registration security code from
   * the user and verify them against the server.
   */
  async submitTripCodes(): Promise<void> {
    this.loading.set(true);

    try {
      await this.registrationService.validateCodes(
        this.tripId() ?? this.tripCodeForm.getRawValue().tripId,
        this.tripCodeForm.value.code,
        this.translate.getCurrentLang(),
      );
      await this.router.navigateByUrl('/register');
    } catch (err) {
      this.resetForm();
      this.logger.info('TripCodesComponent: Error posting trip-codes', err);
      this.dialog.open(CodeErrorDialogComponent, {
        data: {
          title: 'ERROR',
          content: err instanceof InvalidTripCodeError ? 'WRONG_CODES' : 'SERVER_ERROR_TRY_LATER',
        },
      });
    } finally {
      this.loading.set(false);
    }
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
      data: { lang: this.translate.getCurrentLang() },
    });
  }
}

@Component({
  selector: 'app-code-error-dialog-component',
  templateUrl: './code-error-dialog.component.html',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    TranslatePipe,
  ],
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
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    TranslatePipe,
  ],
})
export class TripCodeHelpDialogComponent {
  dialogRef = inject<MatDialogRef<TripCodeHelpDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  dismiss() {
    this.dialogRef.close();
  }
}
