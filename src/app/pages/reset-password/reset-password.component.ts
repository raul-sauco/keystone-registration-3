import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  NonNullableFormBuilder,
  ReactiveFormsModule,
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs';

import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { passwordMatchValidator } from '@directives/password-match-validator.directive';
import { DialogData } from '@interfaces/dialog-data';
import { CredentialsJson } from '@models/credentials';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    if (!control) {
      return false;
    }

    const interacted = control.dirty || control.touched;

    return !!(interacted && (control.invalid || form?.hasError('passwordMismatch')));
  }
}

interface CheckTokenResponseJson {
  error: boolean;
  code?: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface PasswordResetResponseJson {
  error: boolean;
  message: string;
  access_token: string;
  credentials: CredentialsJson;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardContent,
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
export class ResetPasswordComponent {
  private readonly dialog = inject(MatDialog);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly logger = inject(NGXLogger);

  readonly errorMatcher = new CrossFieldErrorMatcher();

  readonly loading = signal(false);
  readonly accountNotFound = computed(
    () => this.tokenResource.value()?.code === 'TOKEN_MATCH_NO_USER',
  );

  private readonly token = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('token'))),
    {
      initialValue: null,
    },
  );

  readonly tokenResource = resource({
    params: () => this.token(),
    loader: async ({ params: token }) => {
      if (!token) {
        return null;
      }

      this.logger.debug('Validating password reset token');

      return this.api.getAsync<CheckTokenResponseJson>(
        `reset-password?token=${encodeURIComponent(token)}`,
      );
    },
  });

  readonly validating = this.tokenResource.isLoading;

  readonly isTokenValid = computed(() => {
    const response = this.tokenResource.value();
    return !!response && !response.error;
  });

  readonly userData = computed(() => {
    const response = this.tokenResource.value();
    return response?.error ? null : (response?.user ?? null);
  });

  readonly passwordResetForm = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  async submit(): Promise<void> {
    if (this.passwordResetForm.invalid || this.loading()) {
      return;
    }

    const user = this.userData();
    const token = this.token();

    if (!user || !token) {
      return;
    }

    this.loading.set(true);

    const params = {
      password: this.passwordResetForm.value.password,
      token,
    };

    try {
      const resJson = await this.api.patchAsync<PasswordResetResponseJson>(
        `reset-password/${user.id}`,
        params,
      );

      if (resJson.error) {
        this.logger.warn('Password reset error', resJson);
        throw new Error(resJson.message || 'Password reset failed');
      }

      this.logger.debug('Success updating password', resJson);
      this.auth.setAccessToken(resJson.access_token);
      // resJson complies with the AuthCheckResponseJson interface
      this.auth.setCredentials(resJson);

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
    } catch (err) {
      this.passwordResetForm.reset();

      this.logger.error('Error updating password', err);

      this.dialog.open(ResetPasswordDialogComponent, {
        data: {
          title: 'SERVER_ERROR',
          content: 'SERVER_ERROR_TRY_LATER',
        },
      });
    } finally {
      this.loading.set(false);
    }
  }
}

@Component({
  selector: 'app-password-reset-dialog-component',
  templateUrl: './reset-password-dialog-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly dialogRef = inject<MatDialogRef<ResetPasswordDialogComponent>>(MatDialogRef);

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
}
