import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of, throwError } from 'rxjs';

import { Spied } from '@interfaces/spied';
import { Credentials } from '@models/credentials';
import { Image } from '@models/image';
import { PaymentInfo } from '@models/paymentInfo';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { StorageService } from '@services/storage/storage.service';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let storageServiceSpy: Spied<StorageService>;
  let loggerSpy: Spied<NGXLogger>;
  let apiServiceSpy: Spied<ApiService>;
  let authServiceSpy: Spied<AuthService>;

  const keys = { paymentInfo: 'KEYSTONE_ADVENTURES_PAYMENT_INFO_STORAGE_KEY' };
  const mockCredentialsData = {
    username: 'test',
    accessToken: 'test-token',
    type: 8, // School admin type
    studentId: undefined,
  };
  const mockPaymentInfo = {
    required: true,
    open: true,
    termsAccepted: false,
    paid: false,
  };
  const mockPaymentInfoApiResponse = {
    ...{ paid: true, paidDate: '2020-02-20' },
    ...mockPaymentInfo,
  };

  function arrange() {
    TestBed.configureTestingModule({
      providers: [
        { provide: NGXLogger, useValue: loggerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      imports: [HttpClientTestingModule, LoggerTestingModule],
    });
    service = TestBed.inject(PaymentService);
  }

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('Logger', { debug: null, warn: null });
    storageServiceSpy = jasmine.createSpyObj(
      'StorageService',
      {
        get: Promise.resolve(mockPaymentInfo),
        set: Promise.resolve(true),
      },
      {
        keys,
      }
    );
    authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      {
        getCredentials: new Credentials(mockCredentialsData),
        checkAuthenticated: Promise.resolve(true),
      },
      {
        auth$: of(true),
        authenticated: true,
        isTeacher: false,
      }
    );
    apiServiceSpy = jasmine.createSpyObj('ApiService', {
      get: of(mockPaymentInfoApiResponse),
    });
  });

  it('should be created', () => {
    arrange();
    expect(service).toBeTruthy();
  });

  it('should load from storage', fakeAsync(() => {
    arrange();
    expect(authServiceSpy.checkAuthenticated).toHaveBeenCalledTimes(1);
    tick();
    expect(storageServiceSpy.get).toHaveBeenCalledOnceWith(keys.paymentInfo);
    expect(loggerSpy.debug).toHaveBeenCalledWith(
      'PaymentService found info in storage',
      mockPaymentInfo
    );
    expect(apiServiceSpy.get).toHaveBeenCalled();
    // tick();
    expect(service.getPaymentInfo()).toEqual(
      new PaymentInfo(mockPaymentInfoApiResponse),
      'The payment info should have been updated with the server response'
    );
  }));

  it('should handle empty responses', fakeAsync(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', {
      get: of(null),
    });
    arrange();
    tick();
    expect(loggerSpy.warn).toHaveBeenCalledWith(
      'PaymentService Unexpected response from the server',
      null
    );
  }));

  it('should handle errors', fakeAsync(() => {
    const expectedError = new Error('test-error');
    apiServiceSpy = jasmine.createSpyObj('ApiService', {
      get: throwError(expectedError),
    });
    arrange();
    tick();
    expect(loggerSpy.warn).toHaveBeenCalledWith(
      'PaymentService Fetch payment information error',
      expectedError
    );
  }));

  describe('fetching payment proofs', () => {
    const mockPaymentProofResponse = [
      {
        user_id: 1,
        image_id: 1,
        student_id: 1,
        visible: 1,
        type: 1,
        image: {
          id: 123,
          name: 'test-image.jpeg',
        },
      },
    ];

    it('happy path', (done: DoneFn) => {
      apiServiceSpy = jasmine.createSpyObj('ApiService', {
        get: of(mockPaymentProofResponse),
      });
      arrange();
      service.paymentProof$.subscribe({
        next: (images: Image[]) => {
          const expected = mockPaymentProofResponse.map(
            (json) => new Image(json.image)
          );
          expect(images).toEqual(expected);
          done();
        },
        error: (error) => {
          fail('This observable should emit');
        },
      });
      service.fetchPaymentProofs();
      expect(loggerSpy.debug).toHaveBeenCalledWith(
        'PaymentService received 1 payment proof images from the server'
      );
    });

    it('error path', (done: DoneFn) => {
      const expectedError = new Error('test-error');
      apiServiceSpy = jasmine.createSpyObj('ApiService', {
        get: throwError(() => expectedError),
      });
      arrange();
      service.paymentProof$.subscribe({
        next: () => {
          fail('This observable should throw');
        },
        error: (error) => {
          expect(error).toEqual(expectedError);
          done();
        },
      });
      service.fetchPaymentProofs();
      expect(loggerSpy.warn).toHaveBeenCalledWith(
        'PaymentService error',
        expectedError
      );
    });
  });
});
