import { TestBed } from '@angular/core/testing';

import { PackingListService } from './packing-list.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('PackingListService', () => {
  let service: PackingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(PackingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
