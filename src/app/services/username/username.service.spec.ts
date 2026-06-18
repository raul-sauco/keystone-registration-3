import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { UsernameService } from './username.service';

describe('UsernameService', () => {
  beforeEach(waitForAsync(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, LoggerTestingModule],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    })));

  it('should be created', () => {
    const service: UsernameService = TestBed.inject(UsernameService);
    expect(service).toBeTruthy();
  });
});
