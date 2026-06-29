import { CdkScrollable } from '@angular/cdk/scrolling';
import { AsyncPipe, formatDate } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormGroupDirective,
  FormsModule,
  NgForm,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
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
  userRegistrationForm!: UntypedFormGroup;
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
      this.initUserRegistrationForm();
    }
    this.fetchContents();
  }

  /**
   * Fetch content that needs to be displayed in the UI.
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

  /**
   * Initializes the first form of the registration that collects
   * the trip's id and code that students/teachers need to use to
   * register for the trip.
   */
  initUserRegistrationForm(): void {
    this.userRegistrationForm = this.formBuilder.group(
      {
        id: this.formBuilder.control('', {
          validators: [Validators.required],
          asyncValidators: [(control) => this.usernameValidator.validate(control)],
          updateOn: 'blur',
        }),
        // email: ['', Validators.email],
        name: ['', Validators.required],
        dob: ['', Validators.required],
        password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        passwordConfirm: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      },
      { validators: passwordMatchValidator },
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
   * POST user details to the server.
   * If successful, it will create a new Student record
   */
  async submitUserRegistration() {
    this.loading.set(true);
    try {
      this.registrationService.submitUserRegistration(
        this.userRegistrationForm.value.id,
        this.userRegistrationForm.value.name,
        this.sanitizeDate(this.userRegistrationForm.value.dob) ?? '',
        this.userRegistrationForm.value.password,
      );
      this.displayRegistrationSuccess();
    } catch (err) {
      this.logger.error('Error posting registration data', err);
      // Server error or data has an error?
      // this.dialog.open(ErrorMessageDialogComponent, {
      //   data: {
      //     title: 'ERROR',
      //     content: response.message,
      //   },
      // });
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

  /**
   * Validate a date and prepare it to be sent to the server.
   * @param dateString
   * @returns
   */
  sanitizeDate(date: Date): string | null {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      this.logger.error(`Failed to format date ${date}`);
      return null;
    }
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
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
