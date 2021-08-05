import { UsernameServiceStub } from './../../testing/src/stubs/username-service-stub';
import { UsernameService } from './../services/username/username.service';
import { waitForAsync, TestBed } from '@angular/core/testing';
import {
  UniqueUsernameValidator,
  UniqueUsernameValidatorDirective,
} from './unique-username-validator.directive';

describe('UniqueUsernameValidatorDirective', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: UsernameService,
            useClass: UsernameServiceStub,
          },
        ],
      });
    })
  );
  it('should create an instance', () => {
    const directive = new UniqueUsernameValidatorDirective(
      new UniqueUsernameValidator(TestBed.inject(UsernameService))
    );
    expect(directive).toBeTruthy();
  });
});
