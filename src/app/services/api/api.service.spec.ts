import { GlobalsService } from 'src/app/services/globals/globals.service';
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        { provide: GlobalsService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
