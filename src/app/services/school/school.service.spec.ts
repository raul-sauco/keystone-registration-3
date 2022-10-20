import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';
import { Spied } from 'src/app/interfaces/spied';
import { Credentials } from 'src/app/models/credentials';
import { School } from 'src/app/models/school';

import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SchoolService } from 'src/app/services/school/school.service';
import { StorageService } from 'src/app/services/storage/storage.service';

describe('SchoolService', () => {
  let service: SchoolService;
  let loggerSpy: Spied<NGXLogger>;
  let authServiceSpy: Spied<AuthService>;
  let storageServiceSpy: Spied<StorageService>;
  let apiServiceSpy: Spied<ApiService>;

  beforeEach(() => {});

  it('should be created', () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule],
    });
    service = TestBed.inject(SchoolService);
    expect(service).toBeTruthy();
  });

  describe('with authentication data', () => {
    const validSchoolData = {
      name: 'Test School',
      nameZh: '測試學校',
      useHouse: true,
      useRoomNumber: true,
      ttl: Date.now() + 1000000,
    };

    beforeEach(() => {
      authServiceSpy = jasmine.createSpyObj(
        'AuthService',
        {
          getCredentials: new Credentials({
            userName: 'test',
            accessToken: 'test-token',
            type: 8, // School admin type
            studentId: undefined,
          }),
          checkAuthenticated: Promise.resolve(true),
        },
        { auth$: of(true) }
      );
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        get: Promise.resolve(validSchoolData),
      });
      loggerSpy = jasmine.createSpyObj('NGXLogger', { debug: null });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, LoggerTestingModule],
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: NGXLogger, useValue: loggerSpy },
        ],
      });
    });

    it('should fetch school on constructor call', fakeAsync(() => {
      service = TestBed.inject(SchoolService);
      expect(service).toBeTruthy();
      tick();
      expect(authServiceSpy.checkAuthenticated).toHaveBeenCalled();
      tick();
      expect(storageServiceSpy.get).toHaveBeenCalled();
      const school: School | undefined = service.getSchool();
      expect(school).toBeTruthy();
      expect(school).toBeInstanceOf(School);
      expect(school?.name).toBe('Test School');
    }));

    it('should log to debug in constructor', fakeAsync(() => {
      service = TestBed.inject(SchoolService);
      tick();
      expect(loggerSpy.debug).toHaveBeenCalledWith('SchoolService constructor');
      tick();
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'SchoolService found valid info in storage',
        validSchoolData
      );
      tick();
      expect(authServiceSpy.getCredentials).not.toHaveBeenCalled();
    }));
  });

  describe('with expired school data', () => {
    const expiredSchoolData = {
      name: 'Test School',
      nameZh: '測試學校',
      useHouse: true,
      useRoomNumber: true,
      ttl: Date.now() - 1000,
    };
    beforeEach(() => {
      // Expired school data
      expiredSchoolData.ttl = Date.now();
      authServiceSpy = jasmine.createSpyObj(
        'AuthService',
        {
          getCredentials: new Credentials({
            userName: 'test',
            accessToken: 'test-token',
            type: 8, // School admin type
            studentId: undefined,
          }),
          checkAuthenticated: Promise.resolve(true),
        },
        { auth$: of(true) }
      );
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        get: Promise.resolve(expiredSchoolData),
      });
      loggerSpy = jasmine.createSpyObj('NGXLogger', { debug: null });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, LoggerTestingModule],
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: NGXLogger, useValue: loggerSpy },
        ],
      });
    });

    it('should fetch data from the server', fakeAsync(() => {
      service = TestBed.inject(SchoolService);
      expect(service).toBeTruthy();
      tick();
      expect(authServiceSpy.getCredentials).toHaveBeenCalled();
    }));
  });

  describe('with no school data', () => {
    beforeEach(() => {
      authServiceSpy = jasmine.createSpyObj(
        'AuthService',
        {
          getCredentials: new Credentials({
            userName: 'test',
            accessToken: 'test-token',
            type: 8, // School admin type
            studentId: undefined,
          }),
          checkAuthenticated: Promise.resolve(true),
        },
        { auth$: of(true) }
      );
      storageServiceSpy = jasmine.createSpyObj('StorageService', {
        get: Promise.resolve(null),
      });
      loggerSpy = jasmine.createSpyObj('NGXLogger', { debug: null });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, LoggerTestingModule],
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          { provide: StorageService, useValue: storageServiceSpy },
          { provide: NGXLogger, useValue: loggerSpy },
        ],
      });
    });

    it('should fetch data from the server', fakeAsync(() => {
      service = TestBed.inject(SchoolService);
      expect(service).toBeTruthy();
      tick();
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'SchoolService found no info in storage'
      );
    }));
  });
});
