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
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { passwordMatchValidator } from 'src/app/directives/password-match-validator.directive';
import { DialogData } from 'src/app/interfaces/dialog-data';
import { Credentials } from 'src/app/models/credentials';

import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  validating = true;
  loading = false;
  isTokenValid = false;
  accountNotFound = false;
  passwordResetForm!: FormGroup;
  errorMatcher!: CrossFieldErrorMatcher;
  userData: any = null;
  private token: string | null = null;

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.logger.debug('ResetPasswordComponent OnInit');
    this.errorMatcher = new CrossFieldErrorMatcher();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.token = params.get('token');
      this.validateToken();
      this.initPasswordResetForm();
    });
  }

  /** Check the validity of the token against the backend. */
  validateToken(): void {
    const endpoint = 'reset-password?token=' + this.token;
    this.api.get(endpoint).subscribe(
      (res: any) => {
        this.validating = false;
        if (!res.error) {
          this.isTokenValid = true;
          this.userData = res.user;
        } else {
          this.isTokenValid = false;
          if (res.code === 'INVALID_TOKEN') {
            this.logger.warn('Error validating password reset token', res);
          } else if (res.code === 'TOKEN_MATCH_NO_USER') {
            this.logger.warn('No user found for password reset token', res);
            this.accountNotFound = true;
          } else {
            this.logger.error('Error validating password reset token', res);
            const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
              data: {
                title: 'SERVER_ERROR',
                content: 'ERROR_PERSISTS_CONTACT_US',
              },
            });
            dialogRef.afterClosed().subscribe(() => {
              this.router.navigateByUrl('/home');
            });
          }
        }
      },
      (err: any) => {
        this.validating = false;
        this.isTokenValid = false;
        this.logger.error('Error validating password reset token', err);
        const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
          data: {
            title: 'SERVER_ERROR',
            content: 'ERROR_PERSISTS_CONTACT_US',
          },
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          this.router.navigateByUrl('/home');
        });
      }
    );
  }

  initPasswordResetForm(): void {
    this.passwordResetForm = this.formBuilder.group(
      {
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

  get password() {
    return this.passwordResetForm.get('password');
  }
  get passwordConfirm() {
    return this.passwordResetForm.get('passwordConfirm');
  }

  submit(): void {
    this.loading = true;
    const endpoint = 'reset-password/' + this.userData.id;
    const params = {
      password: this.passwordResetForm.value.password,
      token: this.token,
    };
    this.api.patch(endpoint, params).subscribe(
      (res: any) => {
        this.loading = false;
        this.logger.debug('Success updating password', res);
        if (res.credentials) {
          this.login(res.credentials);
        } else {
          this.logger.warn(
            'Password reset success but not credentials returned',
            res
          );
        }
        const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
          data: {
            title: 'SUCCESS',
            content: 'PASSWORD_RESET_COMPLETE',
            message: 'AUTOMATICALLY_LOGGED_IN',
          },
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigateByUrl('/home');
        });
      },
      (err: any) => {
        this.loading = false;
        this.passwordResetForm.reset();
        this.logger.error('Error updating password', err);
        this.dialog.open(ResetPasswordDialogComponent, {
          data: {
            title: 'SERVER_ERROR',
            content: 'SERVER_ERROR_TRY_LATER',
          },
        });
      }
    );
  }

  /** Log in user */
  login(credentialsData: any): void {
    const cred = new Credentials(credentialsData);
    this.auth
      .setCredentials(cred)
      .then(() => {
        this.logger.debug('Success logging in user');
      })
      .catch((err: any) => {
        this.logger.warn('Error logging user in', err);
      });
  }
}

@Component({
  selector: 'app-password-reset-dialog-component',
  templateUrl: './reset-password-dialog-component.html',
})
export class ResetPasswordDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    auth: AuthService
  ) {}
}
