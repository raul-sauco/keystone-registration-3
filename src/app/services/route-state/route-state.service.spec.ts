import { TestBed } from '@angular/core/testing';

import { RouteStateService } from './route-state.service';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('RouteStateService', () => {
  let service: RouteStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule
      ]
    });
    service = TestBed.inject(RouteStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
