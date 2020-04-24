import { TestBed } from '@angular/core/testing';

import { FaqService } from './faq.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('FaqService', () => {
  let service: FaqService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(FaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
