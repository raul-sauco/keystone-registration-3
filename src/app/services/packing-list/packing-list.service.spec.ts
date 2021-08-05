import { TestBed } from '@angular/core/testing';

import { PackingListService } from './packing-list.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';

describe('PackingListService', () => {
  let service: PackingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
      imports: [HttpClientTestingModule, LoggerTestingModule],
    });
    service = TestBed.inject(PackingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
