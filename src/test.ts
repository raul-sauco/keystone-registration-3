// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// It is important to keep the zone.js import before others. Used by fakeAsync, internally
// used by ngMocks.
// https://stackoverflow.com/a/68797535/2557030
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ngMocks } from 'ng-mocks';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false },
  }
);
// All methods in mock declarations and providers
// will be automatically spied on their creation.
// https://ng-mocks.sudo.eu/extra/auto-spy
ngMocks.autoSpy('jasmine'); // or jest

// ngMocks.defaultMock helps to customize mocks
// globally. Therefore, we can avoid copy-pasting
// among tests.
// https://ng-mocks.sudo.eu/api/ngMocks/defaultMock
// ngMocks.defaultMock(AuthService, () => ({
//   isLoggedIn$: EMPTY,
//   currentUser$: EMPTY,
// }));
