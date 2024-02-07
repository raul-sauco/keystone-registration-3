import { TestBed } from '@angular/core/testing';

import { CustomTranslateLoaderService } from './custom-translate-loader.service';

describe('CustomTranslateLoaderService', () => {
  let service: CustomTranslateLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTranslateLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
