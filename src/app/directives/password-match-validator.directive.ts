import { Directive } from '@angular/core';
import {
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  NG_VALIDATORS,
  AbstractControl,
} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const passwordConfirm = control.get('passwordConfirm');
  return password && passwordConfirm && password.value !== passwordConfirm.value
    ? { passwordMismatch: true }
    : null;
};

@Directive({
  selector: '[appPasswordMatchValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordMatchValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordMatchValidatorDirective {
  static validate(control: AbstractControl): ValidationErrors | null {
    return passwordMatchValidator(control);
  }
}
