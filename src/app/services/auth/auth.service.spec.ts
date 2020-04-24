import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
