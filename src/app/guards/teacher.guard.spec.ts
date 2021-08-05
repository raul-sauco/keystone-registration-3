import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { TeacherGuard } from './teacher.guard';

describe('TeacherGuard', () => {
  let guard: TeacherGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule, RouterTestingModule],
    });
    guard = TestBed.inject(TeacherGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
