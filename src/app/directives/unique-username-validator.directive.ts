import { Directive, forwardRef, Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsernameService } from '../services/username/username.service';

// noinspection JSAnnotator
@Injectable({ providedIn: 'root' })
export class UniqueUsernameValidator implements AsyncValidator {
  private usernameService = inject(UsernameService);


  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.usernameService.isUsernameTaken(control.value).pipe(
      map((isTaken) => (isTaken ? { uniqueUsername: true } : null)),
      catchError(async () => null)
    );
  }
}

@Directive({
    selector: '[appUniqueUsernameValidatorDirective]',
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => UniqueUsernameValidator),
            multi: true,
        },
    ],
    standalone: false
})
export class UniqueUsernameValidatorDirective {
  private validator = inject(UniqueUsernameValidator);


  validate(control: AbstractControl) {
    this.validator.validate(control);
  }
}
