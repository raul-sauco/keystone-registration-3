import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { passwordMatchValidator } from 'src/app/directives/password-match-validator.directive';
import { UniqueUsernameValidator } from 'src/app/directives/unique-username-validator.directive';
import { DialogData } from 'src/app/interfaces/dialog-data';
import { Credentials } from 'src/app/models/credentials';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { TripService } from 'src/app/services/trip/trip.service';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
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
  userRegistrationForm!: FormGroup;
  errorMatcher!: CrossFieldErrorMatcher;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private logger: NGXLogger,
    public router: Router,
    private usernameValidator: UniqueUsernameValidator,
    public dialog: MatDialog,
    public trip: TripService
  ) {}

  ngOnInit(): void {
    this.logger.debug('RegisterComponent OnInit');
    this.errorMatcher = new CrossFieldErrorMatcher();
    if (!this.trip.code || !this.trip.id) {
      this.router.navigateByUrl('/trip-codes');
    } else {
      this.initUserRegistrationForm();
    }
  }

  /**
   * Initializes the first form of the registration that collects
   * the trip's id and code that students/teachers need to use to
   * register for the trip.
   */
  initUserRegistrationForm(): void {
    this.userRegistrationForm = this.formBuilder.group(
      {
        username: new FormControl('', {
          validators: [Validators.required],
          asyncValidators: [
            this.usernameValidator.validate.bind(this.usernameValidator),
          ],
          updateOn: 'blur',
        }),
        email: ['', Validators.email],
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

  get username() {
    return this.userRegistrationForm.get('username');
  }
  get password() {
    return this.userRegistrationForm.get('password');
  }
  get email() {
    return this.userRegistrationForm.get('email');
  }
  get passwordConfirm() {
    return this.userRegistrationForm.get('passwordConfirm');
  }

  /**
   * POST user details to the server.
   * If successful, it will create a new Student record
   */
  submitUserRegistration(): void {
    const params = {
      username: this.userRegistrationForm.value.username,
      password: this.userRegistrationForm.value.password,
      email: this.userRegistrationForm.value.email,
      tripId: this.trip.id,
      code: this.trip.code,
    };
    this.loading = true;

    this.api.post('r', params).subscribe(
      (response: any) => {
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
      (error: any) => {
        this.dialog.open(ErrorMessageDialogComponent, {
          data: {
            title: 'ERROR',
            content: 'SERVER_ERROR_TRY_LATER',
          },
        });
      }
    );
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
    this.username = auth.getCredentials()?.userName || null;
  }
}
