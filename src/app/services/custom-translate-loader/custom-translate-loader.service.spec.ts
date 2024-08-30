import { TestBed } from '@angular/core/testing';

import { CustomTranslationsLoader } from './custom-translate-loader.service';

describe('CustomTranslateLoaderService', () => {
  let service: CustomTranslationsLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTranslationsLoader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
