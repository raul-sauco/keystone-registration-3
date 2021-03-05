import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

import { passwordMatchValidator } from 'src/app/directives/password-match-validator.directive';
import { UniqueUsernameValidator } from 'src/app/directives/unique-username-validator.directive';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.scss'],
})
export class AddParticipantComponent implements OnInit {
  participantForm: FormGroup;
  errorMatcher: CrossFieldErrorMatcher;
  loading: false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<AddParticipantComponent>,
    private formBuilder: FormBuilder,
    private logger: NGXLogger,
    private uniqueUsernameValidator: UniqueUsernameValidator
  ) {}

  ngOnInit(): void {
    this.logger.debug('AddParticipantComponent OnInit');
    this.errorMatcher = new CrossFieldErrorMatcher();
    this.initParticipantForm();
  }

  initParticipantForm(): void {
    this.participantForm = this.formBuilder.group(
      {
        username: new FormControl('', {
          validators: [Validators.required],
          asyncValidators: [
            this.uniqueUsernameValidator.validate.bind(
              this.uniqueUsernameValidator
            ),
          ],
          updateOn: 'blur',
        }),
        firstName: ['', Validators.maxLength(120)],
        lastName: ['', Validators.maxLength(120)],
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
    return this.participantForm.get('username');
  }
  get password() {
    return this.participantForm.get('password');
  }
  get firstName() {
    return this.participantForm.get('firstName');
  }
  get lastName() {
    return this.participantForm.get('lastName');
  }
  get email() {
    return this.participantForm.get('email');
  }
  get passwordConfirm() {
    return this.participantForm.get('passwordConfirm');
  }

  /**
   * Post the information to the server.
   * TODO add tests and error checking and displaying.
   */
  submitForm(): void {
    const data = this.participantForm.value;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    this.logger.debug('Posting participant data', data);
    this.api.post('students', data, options).subscribe(
      (res: any) => {
        this.dialogRef.close(true);
      },
      (error: any) => {
        this.logger.error(
          'Error creating new participant',
          error,
          this.auth.getCredentials()
        );
      }
    );
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
