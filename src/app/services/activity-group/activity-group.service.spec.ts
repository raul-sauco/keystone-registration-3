import { TestBed } from '@angular/core/testing';

import { ActivityGroupService } from './activity-group.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('ActivityGroupService', () => {
  let service: ActivityGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(ActivityGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
