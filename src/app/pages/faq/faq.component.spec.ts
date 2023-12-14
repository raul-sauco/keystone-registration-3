import { MockBuilder, MockRender } from 'ng-mocks';
import { FaqComponent } from './faq.component';

describe('FaqComponent', () => {
  beforeEach(() => {
    return MockBuilder(FaqComponent);
  });

  it('should create', () => {
    const fixture = MockRender(FaqComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
