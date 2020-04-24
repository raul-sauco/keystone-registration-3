import { TestBed } from '@angular/core/testing';

import { GuideService } from './guide.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('GuideService', () => {
  let service: GuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(GuideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
