import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {
  FormGroupDirective,
  FormsModule,
  NgForm,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { LocalizationService } from '@app/services/localization/localization.service';
import { passwordMatchValidator } from '@directives/password-match-validator.directive';
import { UniqueUsernameValidator } from '@directives/unique-username-validator.directive';
import { DialogData } from '@interfaces/dialog-data';
import { UserType } from '@models/credentials';
import { AuthService } from '@services/auth/auth.service';
import { RegistrationService } from '@services/registration/registration.service';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return (control?.dirty && form?.invalid) || false;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatProgressBar,
    MatSuffix,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
  ],
})
export class RegisterComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private readonly localization = inject(LocalizationService);
  private logger = inject(NGXLogger);
  private usernameValidator = inject(UniqueUsernameValidator);

  protected readonly UserType = UserType;
  protected readonly isChinese = this.localization.isChinese;

  dialog = inject(MatDialog);
  registrationService = inject(RegistrationService);
  router = inject(Router);
  translate = inject(TranslateService);

  loading = signal(false);

  readonly userRegistrationForm = this.formBuilder.group(
    {
      id: this.formBuilder.control('', {
        validators: [Validators.required],
        asyncValidators: [(control) => this.usernameValidator.validate(control)],
        updateOn: 'blur',
      }),
      name: ['', Validators.required],
      dob: this.formBuilder.control<Date | null>(null, Validators.required),
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: passwordMatchValidator },
  );
  errorMatcher!: CrossFieldErrorMatcher;

  ngOnInit(): void {
    const tripCodes = this.registrationService.tripCodes();
    if (tripCodes === null) {
      this.logger.warn('RegisterComponent OnInit: Null trip codes, redirecting to trip codes page');
      this.router.navigateByUrl('/trip-codes');
    } else {
      this.errorMatcher = new CrossFieldErrorMatcher();
      this.logger.debug('RegisterComponent OnInit', tripCodes);
    }
  }

  /**
   * POST user details to the server.
   * If successful, it will create a new Student record
   */
  async submitUserRegistration() {
    this.loading.set(true);
    try {
      const { id, name, dob, password } = this.userRegistrationForm.getRawValue();
      await this.registrationService.submitUserRegistration(id, name, dob, password);
      this.displayRegistrationSuccess();
    } catch (err) {
      this.logger.error('Error posting registration data', err);
      this.dialog.open(ErrorMessageDialogComponent, {
        data: {
          title: 'ERROR',
          content: 'SERVER_ERROR_TRY_LATER',
        },
      });
    } finally {
      this.loading.set(false);
    }
  }

  get id() {
    return this.userRegistrationForm.get('id');
  }
  get name() {
    return this.userRegistrationForm.get('name');
  }
  get dob() {
    return this.userRegistrationForm.get('dob');
  }
  // get username() {
  //   return this.userRegistrationForm.get('username');
  // }
  get password() {
    return this.userRegistrationForm.get('password');
  }
  // get email() {
  //   return this.userRegistrationForm.get('email');
  // }
  get passwordConfirm() {
    return this.userRegistrationForm.get('passwordConfirm');
  }

  /**
   * Display a confirmation dialog and navigate to the home page
   * when the user closes the dialog.
   */
  displayRegistrationSuccess(): void {
    this.logger.debug('RegisterComponent registration successful');
    const dialogRef = this.dialog.open(RegistrationSuccessDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl('/personal-info');
    });
  }
}

@Component({
  selector: 'app-error-message-dialog-component',
  templateUrl: './error-message-dialog.component.html',
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslatePipe,
  ],
})
export class ErrorMessageDialogComponent {
  dialogRef = inject<MatDialogRef<ErrorMessageDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'app-registration-success-dialog-component',
  templateUrl: './registration-success-dialog.component.html',
  styleUrls: ['./registration-success-dialog.component.scss'],
  imports: [
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslatePipe,
  ],
})
export class RegistrationSuccessDialogComponent {
  dialogRef = inject<MatDialogRef<RegistrationSuccessDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  username: string | null = null;
  constructor() {
    const auth = inject(AuthService);

    this.username = auth.credentialsSignal()?.username || null;
  }
}
