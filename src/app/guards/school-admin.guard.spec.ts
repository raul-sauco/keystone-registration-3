import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { SchoolAdminGuard } from './school-admin.guard';

describe('SchoolAdminGuard', () => {
  let guard: SchoolAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule, RouterTestingModule],
    });
    guard = TestBed.inject(SchoolAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
