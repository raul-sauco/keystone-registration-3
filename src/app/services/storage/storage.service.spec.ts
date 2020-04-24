import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
