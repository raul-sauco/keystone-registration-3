import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { ApiService } from 'src/app/services/api/api.service';
import { TripService } from 'src/app/services/trip/trip.service';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { map } from 'rxjs';

export interface DialogData {
  title: string;
  content: string;
  lang: string;
}

@Component({
  selector: 'app-trip-codes',
  templateUrl: './trip-codes.component.html',
  styleUrls: ['./trip-codes.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private api = inject(ApiService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private formBuilder = inject(FormBuilder);
  private trip = inject(TripService);
  private logger = inject(NGXLogger);
  dialog = inject(MatDialog);

  readonly tripId = toSignal(
    this.route.paramMap.pipe(map((params: ParamMap) => params.get('id'))),
    { initialValue: null },
  );

  tripCodeForm!: FormGroup;
  loading = false;

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
    const params = {
      id: this.tripId() ?? this.tripCodeForm.getRawValue().tripId,
      code: this.tripCodeForm.value.code,
      lang: this.translate.getCurrentLang(),
    };
    this.loading = true;

    try {
      const response: any = await this.api.postAsync('trip-codes', params);

      if (response.error === false) {
        this.trip.setCodeValues({
          id: response.id,
          name: response.name,
          code: this.tripCodeForm.value.code,
          type: response.registration,
        });
        await this.router.navigateByUrl('/register');
        return;
      } else {
        this.resetForm();
        this.dialog.open(CodeErrorDialogComponent, {
          data: { title: 'ERROR', content: 'WRONG_CODES' },
        });
      }
    } catch (error) {
      this.resetForm();
      this.logger.warn('Error posting trip-codes', params, error);
      this.dialog.open(CodeErrorDialogComponent, {
        data: { title: 'ERROR', content: 'SERVER_ERROR_TRY_LATER' },
      });
    } finally {
      this.loading = false;
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
