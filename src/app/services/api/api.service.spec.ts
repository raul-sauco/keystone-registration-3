import { GlobalsService } from 'src/app/services/globals/globals.service';
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: GlobalsService }],
      imports: [HttpClientTestingModule, LoggerTestingModule],
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
