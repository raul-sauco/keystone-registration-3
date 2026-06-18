import { TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { PackingListService } from './packing-list.service';

describe('PackingListService', () => {
  let service: PackingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PackingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
