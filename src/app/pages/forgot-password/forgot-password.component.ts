import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { DialogData } from 'src/app/interfaces/dialog-data';
import { ApiService } from 'src/app/services/api/api.service';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCard,
    MatCardContent,
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
export class ForgotPasswordComponent implements OnInit {
  private api = inject(ApiService);
  private formBuilder = inject(UntypedFormBuilder);
  dialog = inject(MatDialog);
  private logger = inject(NGXLogger);
  private router = inject(Router);

  passwordRecoveryForm!: UntypedFormGroup;
  loading: boolean = false;

  ngOnInit(): void {
    this.logger.debug('ForgotPasswordComponent OnInit');
    this.initPasswordRecoveryForm();
  }

  /** Initialize the form */
  initPasswordRecoveryForm(): void {
    this.passwordRecoveryForm = this.formBuilder.group({
      email: new UntypedFormControl(
        '',
        Validators.compose([Validators.required, Validators.email]),
      ),
    });
  }

  /** Send the information to the server */
  submit(): void {
    this.loading = true;
    const params = { email: this.passwordRecoveryForm.value.email };
    this.api.post('forgot-password', params).subscribe({
      next: (res) => {
        this.handleResponse(res);
      },
      error: (err: HttpErrorResponse) => {
        this.handleError(err);
      },
    });
  }

  /**
   * Handle a non-error response to posting the email for recovery, the error
   * property of the response can be `true` and this need to be displayed to
   * the user.
   */
  handleResponse(res: any): void {
    this.passwordRecoveryForm.reset();
    this.loading = false;
    if (!res.error) {
      this.logger.debug('Success response generating recovery email', res);
      const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
        data: {
          title: 'EMAIL_SENT',
          content: 'PASSWORD_RECOVERY_EMAIL_SENT',
        },
      });
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigateByUrl('/home');
      });
    } else {
      // Caught error
      let title: string;
      let subtitle: string;
      let content: string;
      switch (res.reason) {
        case 'NO_ACCOUNT':
          title = 'ERROR';
          subtitle = '';
          content = 'ACCOUNT_FOR_THAT_EMAIL_NOT_FOUND';
          break;
        case 'ACCOUNT_INACTIVE':
          title = 'ERROR';
          subtitle = 'ACCOUNT_INACTIVE';
          content = 'ERROR_CONTACT_US';
          break;
        case 'MAILER_ERROR':
          title = 'ERROR';
          subtitle = 'ERROR_SENDING_MAIL';
          content = 'ERROR_PERSISTS_CONTACT_US';
          break;
        default:
          title = 'ERROR';
          subtitle = '';
          content = 'SERVER_ERROR_TRY_LATER';
      }
      this.dialog.open(ForgotPasswordDialogComponent, {
        data: {
          title,
          subtitle,
          content,
        },
      });
    }
  }

  /** Handle an error while posting recovery email to the server. */
  handleError(err: HttpErrorResponse): void {
    this.passwordRecoveryForm.reset();
    this.loading = false;
    this.logger.error(err.message, err);
    this.dialog.open(ForgotPasswordDialogComponent, {
      data: {
        title: 'SERVER_ERROR',
        content: 'SERVER_ERROR_TRY_LATER',
      },
    });
  }
}

@Component({
  selector: 'app-forgot-password-dialog-component',
  templateUrl: './forgot-password-dialog-component.html',
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
export class ForgotPasswordDialogComponent {
  dialogRef = inject<MatDialogRef<ForgotPasswordDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);
}
