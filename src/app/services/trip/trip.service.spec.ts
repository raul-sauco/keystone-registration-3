import { TestBed } from '@angular/core/testing';

import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { Trip } from 'src/app/models/trip';
import { Spied } from '../../interfaces/spied';
import { Credentials } from '../../models/credentials';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';
import { TripService } from './trip.service';

describe('TripService', () => {
  const tripName = 'Test trip name';
  let service: TripService;
  let authServiceSpy: Spied<AuthService>;
  let authSubject: Subject<boolean> = new Subject<boolean>();
  let loggerSpy: Spied<NGXLogger>;
  let storageServiceSpy: Spied<StorageService>;
  let translateServiceSpy: Spied<TranslateService>;

  beforeEach(() => {
    authSubject = new Subject<boolean>();
    authServiceSpy = jasmine.createSpyObj(
      'AuthServiceSpy',
      {
        getCredentials: new Credentials({
          userName: 'test',
          accessToken: 'test-token',
          type: 8, // School admin type
          studentId: undefined,
        }),
        checkAuthenticated: Promise.resolve(true),
      },
      { auth$: authSubject }
    );
    loggerSpy = jasmine.createSpyObj('NGXLoggerSpy', {
      debug: null,
    });
    storageServiceSpy = jasmine.createSpyObj('StorageServiceSpy', {
      get: Promise.resolve(tripName),
      remove: Promise.resolve(null),
      set: Promise.resolve(true),
    });
    translateServiceSpy = jasmine.createSpyObj(
      'TranslateServiceSpy',
      {},
      { currentLang: 'en' }
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(loggerSpy.debug).toHaveBeenCalledOnceWith('TripService::init()');
  });

  it('should subscribe to authentication status changes', () => {
    expect(loggerSpy.debug).toHaveBeenCalledTimes(1);
    authSubject.next(true);
    expect(loggerSpy.debug).toHaveBeenCalledTimes(2);
    expect(loggerSpy.debug).toHaveBeenCalledWith(
      'Updated authentication status true'
    );
  });

  it('should clear state on auth false', (done: DoneFn) => {
    expect(loggerSpy.debug).toHaveBeenCalledTimes(1);
    service.tripName$.subscribe((name) => {
      expect(name).toEqual(
        '',
        'We are sending a false auth value, it should clear the service'
      );
    });
    authSubject.next(false);
    expect(storageServiceSpy.remove).toHaveBeenCalledWith(
      'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA'
    );
    done();
  });

  it('should set code values', () => {
    const values = { id: 1, name: 'name', code: 'DE02', type: 't' };
    service.setCodeValues(values);
    expect(service.id).toEqual(values.id);
    expect(service.name).toEqual(values.name);
    expect(service.code).toEqual(values.code);
    expect(service.type).toEqual(values.type);
  });

  it('should set and remove trip', (done: DoneFn) => {
    // Expect the empty trip name, then the set name, then remove name.
    const marbles = ['', 'name', ''];
    let calls = 0;
    expect(loggerSpy.debug).toHaveBeenCalledTimes(1);
    const tripData = {
      id: 123,
      name_en: 'name',
      name_zh: 'ming',
      accept_direct_payment: 0,
    };
    service.tripName$.subscribe((name) => {
      expect(name).toEqual(marbles[calls]);
      calls++;
    });
    service.setTrip(tripData);
    expect(storageServiceSpy.set).toHaveBeenCalledWith(
      'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA',
      new Trip(tripData)
    );
    authSubject.next(false);
    expect(storageServiceSpy.remove).toHaveBeenCalledWith(
      'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA'
    );
    done();
  });
});
