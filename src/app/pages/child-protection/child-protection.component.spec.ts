import { MockBuilder, MockRender } from 'ng-mocks';

import { ChildProtectionComponent } from './child-protection.component';

describe('ChildProtectionComponent', () => {
  beforeEach(() => {
    return MockBuilder(ChildProtectionComponent);
  });

  it('should create', () => {
    const fixture = MockRender(ChildProtectionComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
