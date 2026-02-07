import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { UsernameService } from './username.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UsernameService', () => {
  beforeEach(waitForAsync(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, LoggerTestingModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    })));

  it('should be created', () => {
    const service: UsernameService = TestBed.inject(UsernameService);
    expect(service).toBeTruthy();
  });
});
