import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { PaymentService } from '@services/payment/payment.service';
import { RouteStateService } from '@services/route-state/route-state.service';
import { StudentService } from '@services/student/student.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    TranslateModule,
  ],
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private formBuilder = inject(UntypedFormBuilder);
  private logger = inject(NGXLogger);
  private snackbar = inject(MatSnackBar);
  private translate = inject(TranslateService);
  private routeStateService = inject(RouteStateService);
  private paymentService = inject(PaymentService);
  private studentService = inject(StudentService);

  loginForm!: UntypedFormGroup;
  loading: boolean = false;
  errorMsg: string | null = null;

  ngOnInit(): void {
    this.logger.debug('LoginComponent onInit');
    // Set the routeStateService service parameter to null.
    this.routeStateService.setNullTripIdParamState();
    this.initLoginForm();
  }

  /** Initialize the login form with 2 fields, both required */
  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: new UntypedFormControl('', Validators.required),
      password: new UntypedFormControl('', Validators.required),
    });
  }

  /** Send the login information to the backend */
  submitLogin() {
    this.loading = true;
    const params = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };
    this.logger.debug(`Sending login request for ${params.username}`);
    this.api.post('login', params).subscribe({
      next: (res: any) => {
        // Todo
        if (!res.error && res.credentials && res.access_token) {
          this.auth.setAuth(res);
          this.paymentService.fetchFromServer();
          this.studentService.refreshStudent();
          this.router.navigateByUrl('/home');
        } else {
          this.logger.debug(`Failed Login attempt for User: ${params.username}`);
          this.translate
            .get('AUTHENTICATION_FAILURE')
            .subscribe((translation: string) => {
              this.notifyError(translation);
            });
        }
      },
      error: (error) => {
        this.logger.warn(
          `Server or Network login error. Username: ${params.username}`,
          error
        );
        this.translate
          .get('SERVER_ERROR_TRY_LATER')
          .subscribe((translation: string) => {
            this.notifyError(translation);
          });
      },
    });
  }

  /**
   * Notify the user of an error while trying to login
   */
  notifyError(msg: string): void {
    this.loading = false;
    this.errorMsg = msg;
    this.snackbar.open(msg, undefined, {
      duration: 6000,
    });
    this.loginForm.reset();
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.controls[key].setErrors(null);
    });
  }
}
