import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';

import { Credentials } from 'src/app/models/credentials';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean;
  errorMsg: string | null = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private logger: NGXLogger,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private routeStateService: RouteStateService
  ) {
    this.loading = false;
    this.logger.debug('LoginComponent constructor');
  }

  ngOnInit(): void {
    this.logger.debug('LoginComponent onInit');
    // Set the routeStateService service parameter to null.
    this.routeStateService.setNullTripIdParamState();
    this.initLoginForm();
  }

  /** Initialize the login form with 2 fields, both required */
  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  /** Send the login information to the backend */
  submitLogin() {
    // Todo display loading status
    this.loading = true;

    const params = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.logger.debug(`Sending login request for ${params.username}`);

    this.api.post('login', params).subscribe({
      next: (res: any) => {
        // Todo
        if (!res.error && res.credentials) {
          // Creating the Credentials object does some error checking
          const cred = new Credentials(res.credentials);
          // TODO remember where the user was and navigate back
          this.auth.setCredentials(cred).then(() => {
            this.router.navigateByUrl('/home').then(() => {
              // Clean up the page here if needed
            });
          });
        } else {
          this.logger.debug(
            `Failed Login attempt for User: ${params.username}`
          );
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
