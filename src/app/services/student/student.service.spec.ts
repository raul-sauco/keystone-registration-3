import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { StudentService } from './student.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [LoggerTestingModule],
    providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(StudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
