import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator, NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import { UsernameService } from '../services/username/username.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// noinspection JSAnnotator
@Injectable({ providedIn: 'root' })
export class UniqueUsernameValidator implements AsyncValidator {
  constructor(private usernameService: UsernameService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.usernameService.isUsernameTaken(control.value).pipe(
      map(isTaken => (isTaken ? { uniqueUsername: true } : null)),
      catchError(() => null)
    );
  }
}

@Directive({
  selector: '[appUniqueUsernameValidatorDirective]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => UniqueUsernameValidator),
    multi: true
  }]
})
export class UniqueUsernameValidatorDirective {
  constructor(private validator: UniqueUsernameValidator) { }

  validate(control: AbstractControl) {
    this.validator.validate(control);
  }
}
