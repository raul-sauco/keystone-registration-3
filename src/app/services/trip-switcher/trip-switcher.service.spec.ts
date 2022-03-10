import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TripSwitcherService } from './trip-switcher.service';

describe('TripSwitcherService', () => {
  let service: TripSwitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule],
    });
    service = TestBed.inject(TripSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
