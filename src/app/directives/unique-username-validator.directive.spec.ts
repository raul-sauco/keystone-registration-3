import { UsernameService } from './../services/username/username.service';
import { waitForAsync, TestBed } from '@angular/core/testing';
import {
  UniqueUsernameValidator,
  UniqueUsernameValidatorDirective,
} from './unique-username-validator.directive';

describe('UniqueUsernameValidatorDirective', () => {
  let mockUsernameService;
  beforeEach(() => {
    mockUsernameService = jasmine.createSpyObj(['usernameService']);
    mockUsernameService.isUsernameTaken.and.returnValue(false);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UsernameService,
          useValue: jasmine.createSpyObj('mockUsernameService', [
            'isUsernameTaken',
          ]),
        },
      ],
    });
  });
  it('should create an instance', () => {
    const directive = new UniqueUsernameValidatorDirective(
      new UniqueUsernameValidator(TestBed.inject(UsernameService))
    );
    expect(directive).toBeTruthy();
  });
});
