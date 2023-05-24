import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { Spied } from '@interfaces/spied';
import { Credentials } from '@models/credentials';
import { StorageService } from '@services/storage/storage.service';
import { AuthService } from './auth.service';

const userData = {
  username: 'Test Username',
  accessToken: 'test-token',
  type: 0,
  studentId: 1,
};

const keys = {
  credentials: 'KEYSTONE_ADVENTURES_CREDENTIALS_STORAGE_KEY',
  currentTrip: 'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA',
  paymentInfo: 'KEYSTONE_ADVENTURES_PAYMENT_INFO_STORAGE_KEY',
  schoolService: 'KEYSTONE_ADVENTURES_SCHOOL_SERVICE_STORAGE_KEY',
};

describe('AuthService', () => {
  let service: AuthService;
  let storageServiceSpy: Spied<StorageService>;
  let loggerSpy: Spied<NGXLogger>;

  describe('creation', () => {
    beforeEach(() => {
      storageServiceSpy = jasmine.createSpyObj(
        'StorageService',
        {
          get: Promise.resolve(userData),
        },
        {
          keys,
        }
      );
      loggerSpy = jasmine.createSpyObj('Logger', { debug: null, warn: null });
      TestBed.configureTestingModule({
        providers: [
          { provide: NGXLogger, useValue: loggerSpy },
          { provide: StorageService, useValue: storageServiceSpy },
        ],
        imports: [LoggerTestingModule],
      });
    });

    it('component should be created', () => {
      service = TestBed.inject(AuthService);
      expect(service).toBeTruthy();
      expect(loggerSpy.debug).toHaveBeenCalledWith('AuthService constructor');
    });

    it('should become authenticated when credentials are found in storage', fakeAsync(() => {
      service = TestBed.inject(AuthService);
      expect(service.authenticated).toBeFalse();
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'AuthService.checkAuthenticated(); did not have credentials, checking storage'
      );
      tick();
      expect(storageServiceSpy.get).toHaveBeenCalledWith(
        'KEYSTONE_ADVENTURES_CREDENTIALS_STORAGE_KEY'
      );
      tick();
      expect(loggerSpy.warn).not.toHaveBeenCalled();
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'AuthService.checkAuthenticated(); got credentials from StorageService',
        userData
      );
      expect(service.authenticated).toBeTrue();
    }));

    it('should fail when credentials are not found in storage', fakeAsync(() => {
      storageServiceSpy.get.and.resolveTo(null);
      service = TestBed.inject(AuthService);
      tick();
      expect(storageServiceSpy.get).toHaveBeenCalledWith(
        'KEYSTONE_ADVENTURES_CREDENTIALS_STORAGE_KEY'
      );
      tick();
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'AuthService.checkAuthenticated(); did not get credentials from StorageService'
      );
      tick();
      expect(service.authenticated).toBeFalse();
    }));

    it('should fail when storage service rejects the promise', fakeAsync(() => {
      const rejectError = {
        error: true,
        msg: 'localStorage not available in browser',
      };
      storageServiceSpy.get.and.rejectWith(rejectError);
      service = TestBed.inject(AuthService);
      tick();
      expect(storageServiceSpy.get).toHaveBeenCalledWith(
        'KEYSTONE_ADVENTURES_CREDENTIALS_STORAGE_KEY'
      );
      tick();
      expect(loggerSpy.warn).toHaveBeenCalledWith(
        'AuthService.checkAuthenticated(); Error getting credentials from storage',
        rejectError
      );
      tick();
      expect(service.authenticated).toBeFalse();
    }));
  });

  describe('after create', () => {
    beforeEach(() => {
      storageServiceSpy = jasmine.createSpyObj(
        'StorageService',
        {
          get: Promise.resolve(userData),
          set: Promise.resolve(true),
          remove: Promise.resolve(true),
          removeAll: Promise.resolve(true),
        },
        { keys }
      );
      loggerSpy = jasmine.createSpyObj('Logger', { debug: null, warn: null });
      TestBed.configureTestingModule({
        providers: [
          { provide: NGXLogger, useValue: loggerSpy },
          { provide: StorageService, useValue: storageServiceSpy },
        ],
        imports: [LoggerTestingModule],
      });
    });

    it('should become authenticated when credentials are found in storage', fakeAsync(async () => {
      service = TestBed.inject(AuthService);
      expect(service.authenticated).toBeFalse();
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'AuthService.checkAuthenticated(); did not have credentials, checking storage'
      );
      tick();
      expect(storageServiceSpy.get).toHaveBeenCalledWith(
        'KEYSTONE_ADVENTURES_CREDENTIALS_STORAGE_KEY'
      );
      tick();
      expect(loggerSpy.warn).not.toHaveBeenCalled();
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'AuthService.checkAuthenticated(); got credentials from StorageService',
        userData
      );
      expect(service.authenticated).toBeTrue();
      service.checkAuthenticated().then((res) => {
        expect(loggerSpy.debug).toHaveBeenCalledWith(
          'AuthService.checkAuthenticated(); had credentials: ',
          new Credentials(userData)
        );
        expect(res).toBeTrue();
      });
    }));

    it('should logout the user', fakeAsync(() => {
      service = TestBed.inject(AuthService);
      storageServiceSpy.remove.and.resolveTo(true);
      tick();
      expect(service.authenticated).toBeTrue();
      service.logout().then((res) => {
        expect(res).toBeTrue();
      });
    }));

    it('should be able to update credentials', fakeAsync(() => {
      const credData = { ...userData, ...{ username: 'updated' } };
      service = TestBed.inject(AuthService);
      storageServiceSpy.remove.and.resolveTo(true);
      tick();
      expect(service.authenticated).toBeTrue();
      service.setCredentials(new Credentials(credData));
      expect(service.getCredentials()?.username).toBe('updated');
    }));

    it('should correctly identify the user type teacher', fakeAsync(() => {
      const credData = { ...userData, ...{ username: 'updated' } };
      service = TestBed.inject(AuthService);
      tick();
      expect(service.authenticated).toBeTrue();
      service.setCredentials(new Credentials(credData));
      expect(service.getCredentials()?.username).toBe('updated');
      expect(service.isTeacher)
        .withContext('user type 0 should not be identified as teacher')
        .toBeFalse();
      credData.type = 4;
      service.setCredentials(new Credentials(credData));
      expect(service.isTeacher)
        .withContext('user type 4 should be identified as teacher')
        .toBeTrue();
    }));

    it('should correctly identify the user type student', fakeAsync(() => {
      const credData = { ...userData, ...{ type: 6 } };
      service = TestBed.inject(AuthService);
      tick();
      expect(service.isStudent)
        .withContext('user type 0 should not be identified as student')
        .toBeFalse();
      service.setCredentials(new Credentials(credData));
      expect(service.isStudent)
        .withContext('user type 6 should be identified as student')
        .toBeTrue();
    }));

    it('should correctly identify the user type school admin', fakeAsync(() => {
      const credData = { ...userData, ...{ type: 8 } };
      service = TestBed.inject(AuthService);
      tick();
      expect(service.isSchoolAdmin)
        .withContext('user type 0 should not be identified as school admin')
        .toBeFalse();
      service.setCredentials(new Credentials(credData));
      expect(service.isSchoolAdmin)
        .withContext('user type 8 should be identified as school admin')
        .toBeTrue();
    }));
  });
});
