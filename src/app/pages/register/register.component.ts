import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
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
import { MarkdownComponent } from 'ngx-markdown';
import { Observable, map } from 'rxjs';

import { UserType } from '@app/models/credentials';
import { RegistrationService } from '@app/services/registration/registration.service';
import { passwordMatchValidator } from '@directives/password-match-validator.directive';
import { UniqueUsernameValidator } from '@directives/unique-username-validator.directive';
import { DialogData } from '@interfaces/dialog-data';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';

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
  imports: [
    AsyncPipe,
    FormsModule,
    MarkdownComponent,
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
  private api = inject(ApiService);
  private formBuilder = inject(NonNullableFormBuilder);
  private logger = inject(NGXLogger);
  private usernameValidator = inject(UniqueUsernameValidator);
  protected readonly UserType = UserType;
  auth = inject(AuthService);
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
  namePromptContent$!: Observable<string>;

  ngOnInit(): void {
    const tripCodes = this.registrationService.tripCodes();
    if (tripCodes === null) {
      this.logger.warn('RegisterComponent OnInit: Null trip codes, redirecting to trip codes page');
      this.router.navigateByUrl('/trip-codes');
    } else {
      this.errorMatcher = new CrossFieldErrorMatcher();
      this.logger.debug('RegisterComponent OnInit', tripCodes);
    }
    this.fetchContents();
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

  /**
   * TODO: Use i18n translations
   */
  fetchContents() {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.namePromptContent$ = this.api
      .get('documents/141', null, options)
      .pipe(
        map((doc: any) =>
          this.translate.getCurrentLang().includes('zh') ? doc.text_zh : doc.text,
        ),
      );
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
