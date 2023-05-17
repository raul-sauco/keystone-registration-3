import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroupDirective,
  NgForm,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NGXLogger } from 'ngx-logger';

import { HttpHeaders } from '@angular/common/http';
import { passwordMatchValidator } from '@directives/password-match-validator.directive';
import { DialogData } from '@interfaces/dialog-data';
import { Credentials } from '@models/credentials';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { TripService } from '@services/trip/trip.service';
import { Observable } from 'rxjs';
// import { UniqueUsernameValidator } from 'src/app/directives/unique-username-validator.directive';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return (control?.dirty && form?.invalid) || false;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  loading: boolean = false;
  userRegistrationForm!: UntypedFormGroup;
  errorMatcher!: CrossFieldErrorMatcher;
  namePromptContent$!: Observable<any>;
  lang: string = 'en';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private paymentService: PaymentService,
    private formBuilder: UntypedFormBuilder,
    private logger: NGXLogger,
    private translate: TranslateService,
    public router: Router,
    // private usernameValidator: UniqueUsernameValidator,
    public dialog: MatDialog,
    public trip: TripService
  ) {}

  ngOnInit(): void {
    this.logger.debug('RegisterComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    this.errorMatcher = new CrossFieldErrorMatcher();
    if (!this.trip.code || !this.trip.id) {
      this.router.navigateByUrl('/trip-codes');
    } else {
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
    this.namePromptContent$ = this.api.get('documents/141', null, options);
  }

  /**
   * Initializes the first form of the registration that collects
   * the trip's id and code that students/teachers need to use to
   * register for the trip.
   */
  initUserRegistrationForm(): void {
    this.userRegistrationForm = this.formBuilder.group(
      {
        // username: new UntypedFormControl('', {
        //   validators: [Validators.required],
        //   asyncValidators: [
        //     this.usernameValidator.validate.bind(this.usernameValidator),
        //   ],
        //   updateOn: 'blur',
        // }),
        // TODO: Validate unique IDs
        id: ['', Validators.required],
        // email: ['', Validators.email],
        name: ['', Validators.required],
        dob: ['', Validators.required],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
        passwordConfirm: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
      },
      { validator: passwordMatchValidator }
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
  submitUserRegistration(): void {
    const params = {
      // username: this.userRegistrationForm.value.username,
      password: this.userRegistrationForm.value.password,
      // email: this.userRegistrationForm.value.email,
      name: this.userRegistrationForm.value.name,
      id: this.userRegistrationForm.value.id,
      dob: this.sanitizeDate(this.userRegistrationForm.value.dob),
      tripId: this.trip.id,
      code: this.trip.code,
    };
    this.loading = true;

    // this.api.post('r', params).subscribe({next: })

    this.api.post('r', params).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (response.error === true) {
          this.dialog.open(ErrorMessageDialogComponent, {
            data: {
              title: 'ERROR',
              content: response.message,
            },
          });
        } else {
          const cred = new Credentials(response.credentials);
          this.auth.setCredentials(cred).then(() => {
            this.loading = false;
            this.paymentService.fetchFromServer();
            this.displayRegistrationSuccess();
          });
        }
      },
      error: (error: any) => {
        this.logger.error('Error posting registration data', error);
        this.dialog.open(ErrorMessageDialogComponent, {
          data: {
            title: 'ERROR',
            content: 'SERVER_ERROR_TRY_LATER',
          },
        });
      },
    });
  }

  /**
   * Display a confirmation dialog and navigate to the home page
   * when the user closes the dialog.
   */
  displayRegistrationSuccess(): void {
    this.logger.debug('RegisterComponent registration successful');
    const dialogRef = this.dialog.open(RegistrationSuccessDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigateByUrl('/waiver');
    });
  }

  /**
   * Validate a date and prepare it to be sent to the server.
   * @param d
   * @returns
   */
  sanitizeDate(d: string | moment.Moment): string | null {
    // Make sure we are dealing with a moment object.
    if (!moment.isMoment(d)) {
      d = moment(d);
    }
    if (d.isValid()) {
      return d.format('YYYY-MM-DD');
    }
    this.logger.error(`Trying to format invalid date ${d}`);
    return null;
  }
}

@Component({
  selector: 'app-error-message-dialog-component',
  templateUrl: './error-message-dialog.component.html',
})
export class ErrorMessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}

@Component({
  selector: 'app-registration-success-dialog-component',
  templateUrl: './registration-success-dialog.component.html',
})
export class RegistrationSuccessDialogComponent {
  username: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<RegistrationSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    auth: AuthService
  ) {
    this.username = auth.getCredentials()?.username || null;
  }
}
