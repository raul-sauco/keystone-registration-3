import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subject, of } from 'rxjs';

import { Spied } from '@interfaces/spied';
import { Credentials } from '@models/credentials';
import { Trip } from '@models/trip';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { StorageService } from '@services/storage/storage.service';
import { TripSwitcherService } from '@services/trip-switcher/trip-switcher.service';
import { TripService } from './trip.service';

describe('TripService', () => {
  const tripName = 'Test trip name';
  const tripData = {
    id: 123,
    name_en: 'name',
    name_zh: 'ming',
    accept_direct_payment: 0,
  };
  const tripA = new Trip({
    id: 1,
    name_en: 'tripA',
    name_zh: 'tripAzh',
    accept_direct_payment: 0,
  });
  const tripB = new Trip({
    id: 2,
    name_en: 'tripB',
    name_zh: 'tripBzh',
    accept_direct_payment: 0,
  });
  const credentialsA = new Credentials({
    userName: 'test',
    accessToken: 'test-token',
    type: 8, // School admin type
    studentId: undefined,
  });
  let service: TripService;
  let apiServiceSpy: Spied<ApiService>;
  let authServiceSpy: Spied<AuthService>;
  let authSubject: Subject<boolean> = new Subject<boolean>();
  let loggerSpy: Spied<NGXLogger>;
  let storageServiceSpy: Spied<StorageService>;
  let translateServiceSpy: Spied<TranslateService>;
  let tripSwitcherSpy: Spied<TripSwitcherService>;

  beforeEach(() => {
    authSubject = new Subject<boolean>();
    apiServiceSpy = jasmine.createSpyObj('ApiServiceSpy', {
      get: of(new Trip(tripData)),
    });
    authServiceSpy = jasmine.createSpyObj(
      'AuthServiceSpy',
      {
        getCredentials: credentialsA,
        checkAuthenticated: Promise.resolve(true),
      },
      { auth$: authSubject }
    );
    loggerSpy = jasmine.createSpyObj('NGXLoggerSpy', {
      debug: null,
      trace: null,
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
    tripSwitcherSpy = jasmine.createSpyObj(
      'TripSwitcherSpy',
      {
        selectTrip: true,
      },
      { selectedTrip$: of(tripA) }
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: TripSwitcherService, useValue: tripSwitcherSpy },
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

  it('should set and remove trip for school admin', (done: DoneFn) => {
    // Expect the empty trip name, then the set name, then remove name.
    const marbles = ['', 'tripA', ''];
    let calls = 0;
    expect(loggerSpy.debug).toHaveBeenCalledTimes(1);
    // Subscribe to updates on the trip name.
    service.tripName$.subscribe((name) => {
      expect(name).toEqual(
        marbles[calls],
        `Expected call #${calls} to equal ${marbles[calls]} but found ${name}`
      );
      calls++;
    });
    // This should trigger a call to set trip.
    authSubject.next(true);
    // This should trigger a call to clear.
    authSubject.next(false);
    expect(storageServiceSpy.remove).toHaveBeenCalledWith(
      'KEYSTONE_ADVENTURES_CURRENT_TRIP_DATA'
    );
    done();
  });
});
