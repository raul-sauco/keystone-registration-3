import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroupDirective, NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { passwordMatchValidator } from 'src/app/directives/password-match-validator.directive';
import { UniqueUsernameValidator } from 'src/app/directives/unique-username-validator.directive';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl,
    form: FormGroupDirective | NgForm
  ): boolean {
    return control.dirty && form.invalid!;
  }
}

@Component({
    selector: 'app-add-participant',
    templateUrl: './add-participant.component.html',
    styleUrls: ['./add-participant.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, NgIf, MatError, MatProgressBar, MatButton, TranslatePipe]
})
export class AddParticipantComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  dialogRef = inject<MatDialogRef<AddParticipantComponent>>(MatDialogRef);
  private formBuilder = inject(UntypedFormBuilder);
  private logger = inject(NGXLogger);
  private uniqueUsernameValidator = inject(UniqueUsernameValidator);
  private tripSwitcher = inject(TripSwitcherService);

  participantForm!: UntypedFormGroup;
  errorMatcher!: CrossFieldErrorMatcher;
  loading: boolean = false;

  ngOnInit(): void {
    this.logger.debug('AddParticipantComponent OnInit');
    this.errorMatcher = new CrossFieldErrorMatcher();
    this.initParticipantForm();
  }

  initParticipantForm(): void {
    // TODO: use ID as username.
    this.participantForm = this.formBuilder.group(
      {
        username: new UntypedFormControl('', {
          validators: [Validators.required],
          asyncValidators: [
            this.uniqueUsernameValidator.validate.bind(
              this.uniqueUsernameValidator
            ),
          ],
          updateOn: 'blur',
        }),
        name: ['', Validators.maxLength(120)],
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
  get name() {
    return this.participantForm.get('name');
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
    if (this.auth.isSchoolAdmin && this.tripSwitcher.selectedTrip) {
      data.tripId = this.tripSwitcher.selectedTrip.id;
    }
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getAccessToken(),
      }),
    };
    this.logger.debug('Posting participant data', data);
    this.api.post('students', data, options).subscribe({
      next: (res: any) => {
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        this.logger.error(
          'Error creating new participant',
          error,
          this.auth.getCredentials()
        );
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
