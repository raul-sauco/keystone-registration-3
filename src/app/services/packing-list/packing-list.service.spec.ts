import { TestBed } from '@angular/core/testing';

import { PackingListService } from './packing-list.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PackingListService', () => {
  let service: PackingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [LoggerTestingModule],
    providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(PackingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
