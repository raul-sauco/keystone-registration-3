import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { DialogData } from 'src/app/interfaces/dialog-data';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  passwordRecoveryForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private logger: NGXLogger,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logger.debug('ForgotPasswordComponent OnInit');
    this.initPasswordRecoveryForm();
  }

  /** Initialize the form */
  initPasswordRecoveryForm(): void {
    this.passwordRecoveryForm = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.email])
      ),
    });
  }

  /** Send the information to the server */
  submit(): void {
    this.loading = true;
    const params = { email: this.passwordRecoveryForm.value.email };
    this.api.post('forgot-password', params).subscribe(
      (res: any) => {
        this.handleResponse(res);
      },
      (err: any) => {
        this.handleError(err);
      }
    );
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
  handleError(err: any): void {
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
})
export class ForgotPasswordDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    auth: AuthService
  ) {}
}
