import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  NonNullableFormBuilder,
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

import { InvalidTripCodeError, ServerUnavailableError } from '@app/models/error';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly registrationService = inject(RegistrationService);
  private readonly logger = inject(NGXLogger);
  private readonly dialog = inject(MatDialog);

  readonly tripId = toSignal(
    this.route.paramMap.pipe(map((params: ParamMap) => params.get('id'))),
    { initialValue: null },
  );

  readonly loading = signal(false);
  readonly tripCodeForm = this.formBuilder.group({
    tripId: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(4)],
    }),
    code: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    }),
  });

  constructor() {
    this.logger.debug('TripComponent::constructor');
    effect(() => {
      const tripId = this.tripId();
      if (tripId) {
        this.tripCodeForm.controls.tripId.setValue(tripId);
        this.tripCodeForm.controls.tripId.disable({ emitEvent: false });
      } else {
        this.tripCodeForm.controls.tripId.enable({ emitEvent: false });
      }
    });
  }

  /**
   * Get the trip ID and registration security code from
   * the user and verify them against the server.
   */
  async submitTripCodes(): Promise<void> {
    // Prevent multiple submission.
    if (this.tripCodeForm.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const { tripId, code } = this.tripCodeForm.getRawValue();
      await this.registrationService.validateCodes(
        tripId,
        code,
        this.translate.currentLang() ?? 'en',
      );
      await this.router.navigateByUrl('/register');
    } catch (err) {
      const message =
        err instanceof InvalidTripCodeError
          ? 'WRONG_CODES'
          : err instanceof ServerUnavailableError
            ? 'SERVER_ERROR_TRY_LATER'
            : 'UNEXPECTED_ERROR';
      this.tripCodeForm.controls.code.reset();
      this.logger.info('TripCodesComponent: Error posting trip-codes', err);
      this.dialog.open(CodeErrorDialogComponent, {
        data: {
          title: 'ERROR',
          content: message,
        },
      });
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Show a dialog with help content related to the trip codes
   */
  showHelp() {
    this.dialog.open(TripCodeHelpDialogComponent, {
      data: { lang: this.translate.currentLang() },
    });
  }
}

@Component({
  selector: 'app-code-error-dialog-component',
  templateUrl: './code-error-dialog.component.html',
  styleUrls: ['./code-error-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly dialogRef = inject<MatDialogRef<CodeErrorDialogComponent>>(MatDialogRef);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  close() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-trip-code-help-dialog-component',
  templateUrl: './trip-code-help-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  close() {
    this.dialogRef.close();
  }
}
