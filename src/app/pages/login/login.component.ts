import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Credentials } from 'src/app/models/credentials';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean;
  errorMsg: string = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private logger: NGXLogger,
    private snackbar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.loading = false;
    this.logger.debug('LoginComponent constructor');
   }

  ngOnInit(): void {
    this.logger.debug('LoginComponent onInit');
    this.initLoginForm();
  }

  /** Initialize the login form with 2 fields, both required */
  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  /** Send the login information to the backend */
  submitLogin() {

    // Todo display loading status
    this.loading = true;

    const params = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.logger.debug(`Sending login request for ${params.username}`);

    this.api.post('login', params).subscribe(
      (res: any) => {

        // Todo
        if (!res.error && res.credentials) {

          // Creating the Credentials object does some error cheking
          const cred = new Credentials(res.credentials);

          // TODO remember where the user was and navigate back
          this.auth.setCredentials(cred).then(
            () => this.router.navigateByUrl('/home').then(() => {
              // Clean up the page here if needed
            }));

        } else {
          this.logger.debug(
            `Failed Login attempt for User: ${params.username}`);
          this.translate.get('AUTHENTICATION_FAILURE').subscribe(
              (translation: string) => {
                this.notifyError(translation);
          });
        }
      }, error => {
        this.logger.warn(
          `Server or Network login error. Username: ${params.username}`, error);
        this.translate.get(
          'SERVER_ERROR').subscribe(
            (translation: string) => {
              this.notifyError(translation);
        });
      }
    );
  }

  /**
   * Notify the user of an error while trying to login
   */
  notifyError(msg: string): void {
    this.loading = false;
    this.errorMsg = msg;
    this.snackbar.open(
      msg, null, {
        duration: 6000
    });
    this.loginForm.reset();
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.controls[key].setErrors(null);
    });
  }
}
