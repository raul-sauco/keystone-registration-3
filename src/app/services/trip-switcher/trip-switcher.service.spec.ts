import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TripSwitcherService } from './trip-switcher.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TripSwitcherService', () => {
  let service: TripSwitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [LoggerTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(TripSwitcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
