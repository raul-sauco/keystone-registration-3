import { MockBuilder, MockRender } from 'ng-mocks';

import { CovidPolicyComponent } from './covid-policy.component';

describe('CovidPolicyComponent', () => {
  beforeEach(() => {
    return MockBuilder(CovidPolicyComponent);
  });

  it('should create', () => {
    const fixture = MockRender(CovidPolicyComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
