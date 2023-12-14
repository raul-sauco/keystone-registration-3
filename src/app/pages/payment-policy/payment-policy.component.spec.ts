import { MockBuilder, MockRender } from 'ng-mocks';

import { PaymentPolicyComponent } from './payment-policy.component';

describe('PaymentPolicyComponent', () => {
  beforeEach(() => {
    return MockBuilder(PaymentPolicyComponent);
  });

  it('should create', () => {
    const fixture = MockRender(PaymentPolicyComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
