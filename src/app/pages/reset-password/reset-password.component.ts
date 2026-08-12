import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { passwordMatchValidator } from '@directives/password-match-validator.directive';
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
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatProgressBar,
    MatButton,
    RouterLink,
    LoadingSpinnerContentComponent,
    TranslatePipe,
  ],
})
export class ResetPasswordComponent implements OnInit {
  dialog = inject(MatDialog);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(UntypedFormBuilder);
  private logger = inject(NGXLogger);

  validating = true;
  loading = false;
  isTokenValid = false;
  accountNotFound = false;
  passwordResetForm!: UntypedFormGroup;
  errorMatcher!: CrossFieldErrorMatcher;
  userData: any = null;
  private token: string | null = null;

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
    this.api.get(endpoint).subscribe({
      next: (res: any) => {
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
      error: (err: any) => {
        this.validating = false;
        this.isTokenValid = false;
        this.logger.error('Error validating password reset token', err);
        const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
          data: {
            title: 'SERVER_ERROR',
            content: 'ERROR_PERSISTS_CONTACT_US',
          },
        });
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigateByUrl('/home');
        });
      },
    });
  }

  initPasswordResetForm(): void {
    this.passwordResetForm = this.formBuilder.group(
      {
        password: this.formBuilder.control('', {
          validators: [Validators.required, Validators.minLength(8)],
        }),
        passwordConfirm: this.formBuilder.control('', {
          validators: [Validators.required, Validators.minLength(8)],
        }),
      },
      { validators: passwordMatchValidator },
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
    this.api.patch(endpoint, params).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.logger.debug('Success updating password', res);
        if (!res.error) {
          this.auth.setCredentials(res);
        } else {
          this.logger.warn('Password reset error', res);
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
      error: (err: any) => {
        this.loading = false;
        this.passwordResetForm.reset();
        this.logger.error('Error updating password', err);
        this.dialog.open(ResetPasswordDialogComponent, {
          data: {
            title: 'SERVER_ERROR',
            content: 'SERVER_ERROR_TRY_LATER',
          },
        });
      },
    });
  }
}

@Component({
  selector: 'app-password-reset-dialog-component',
  templateUrl: './reset-password-dialog-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class ResetPasswordDialogComponent {
  dialogRef = inject<MatDialogRef<ResetPasswordDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
}
