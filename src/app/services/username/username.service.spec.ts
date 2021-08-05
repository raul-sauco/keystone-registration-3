import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { UsernameService } from './username.service';

describe('UsernameService', () => {
  beforeEach(
    waitForAsync(() =>
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          LoggerTestingModule,
        ],
      })
    )
  );

  it('should be created', () => {
    const service: UsernameService = TestBed.inject(UsernameService);
    expect(service).toBeTruthy();
  });
});
